import { observer } from 'mobx-react-lite'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddress, getAccount, TokenInvalidAccountOwnerError, TokenAccountNotFoundError, createAssociatedTokenAccountInstruction } from '@solana/spl-token'
import { Layout } from './Layout'
import { FC, useEffect, useState } from 'react'
import { LoadingStatusType } from '../types/LoadingStatusType'
import { getAnchorProgram, programId } from '../services/utils'
import { swapStore } from '../stores/SwapStore'
import { acceptSwapInstruction, cancelSwapInstruction, closeEscrowInstruction, transferNftFromOffereeToOfferorInstruction } from '../services/instructions'
import { cancelSwapStore } from '../stores/CancelSwapStore'
import { NftsGrid } from './NftCard'
import { CheckIcon } from './icons/CheckIcon'
import { Skeleton } from './Skeleton'

export const CancelSwap: FC<{ type: 'cancel' | 'accept' }> = observer(({ type }) => {
    const wallet = useWallet()
    const { connection } = useConnection()

    const [isLoading, setIsLoading] = useState(false)

    const loadData = async () => {
        setIsLoading(true)
        await loadSwapState()
        await loadMints()
        setIsLoading(false)
    }

    const loadSwapState = async () => {
        if (!swapStore.userState?.counterParty || !wallet.publicKey) return
        if (type === 'cancel') {
            await cancelSwapStore.loadSwapState(connection, wallet as any, wallet.publicKey, swapStore.userState?.counterParty)
        } else {
            await cancelSwapStore.loadSwapState(connection, wallet as any, swapStore.userState?.counterParty, wallet.publicKey)
        }
    }

    const loadMints = () => {
        if (!wallet.publicKey) return
        return cancelSwapStore.loadMints(wallet.publicKey.toString())
    }

    useEffect(() => {
        loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.publicKey])

    const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>('idle')

    const cancelSwap = async () => {
        if (!wallet.publicKey ||
            !swapStore.userState?.counterParty||
            !cancelSwapStore.swapStatePubKey ||
            !cancelSwapStore.swapState
        ) return

        try {
            setLoadingStatus('loading')

            const offereePubKey = swapStore.userState?.counterParty
            const [offerorState] = await PublicKey.findProgramAddress(
                [Buffer.from('user_state'), wallet.publicKey.toBuffer()], programId
            )
            const [offereeState] = await PublicKey.findProgramAddress(
                [Buffer.from('user_state'), offereePubKey.toBuffer()], programId
            )

            const txn = new Transaction()

            for (const mint of cancelSwapStore.swapState.mintsOfferor) {
                const program = getAnchorProgram(connection, wallet as any)
                const [escrowState] = await PublicKey.findProgramAddress(
                    [Buffer.from('escrow_state'), wallet.publicKey.toBuffer(), mint.toBuffer()], programId
                )
                const state = await program.account.escrowState.fetch(escrowState)
                txn.add(await closeEscrowInstruction({
                    connection,
                    wallet: wallet as any,
                    swapState: cancelSwapStore.swapStatePubKey,
                    escrowState,
                    escrow: state.escrow,
                    mint: state.mint,
                    ata: state.ataOfferor,
                    offeror: wallet.publicKey,
                    offeree: offereePubKey
                }))
            }

            txn.add(
                await cancelSwapInstruction({
                    connection,
                    wallet: wallet as any,
                    swapState: cancelSwapStore.swapStatePubKey,
                    offeror: wallet.publicKey,
                    offeree: offereePubKey,
                    offerorState,
                    offereeState,
                })
            )
            await wallet.sendTransaction(txn, connection)
            setLoadingStatus('finished')
        } catch (error) {
            setLoadingStatus('failed')
        }
    }

    const acceptSwap = async () => {
        if (!wallet.publicKey ||
            !swapStore.userState?.counterParty||
            !cancelSwapStore.swapStatePubKey ||
            !cancelSwapStore.swapState
        ) return

        try {
            setLoadingStatus('loading')

            const offerorPubKey = swapStore.userState?.counterParty
            const [offerorState] = await PublicKey.findProgramAddress(
                [Buffer.from('user_state'), offerorPubKey.toBuffer()], programId
            )
            const [offereeState] = await PublicKey.findProgramAddress(
                [Buffer.from('user_state'), wallet.publicKey.toBuffer()], programId
            )

            const txn = new Transaction()
            
            for (const mint of cancelSwapStore.swapState.mintsOfferor) {
    
                const ataOfferee = await getAssociatedTokenAddress(mint, wallet.publicKey)
                try {
                    await getAccount(connection, ataOfferee, 'finalized')
                } catch (error) {
                    if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
                        txn.add(createAssociatedTokenAccountInstruction(
                            wallet.publicKey,
                            ataOfferee,
                            wallet.publicKey,
                            mint
                        ))
                    }
                }

                const program = getAnchorProgram(connection, wallet as any)
                const [escrowState] = await PublicKey.findProgramAddress(
                    [Buffer.from('escrow_state'), wallet.publicKey.toBuffer(), mint.toBuffer()], programId
                )
                const state = await program.account.escrowState.fetch(escrowState)
                txn.add(await closeEscrowInstruction({
                    connection,
                    wallet: wallet as any,
                    swapState: cancelSwapStore.swapStatePubKey,
                    escrowState,
                    escrow: state.escrow,
                    mint: state.mint,
                    ata: ataOfferee,
                    offeror: offerorPubKey,
                    offeree: wallet.publicKey
                }))
            }

            for (const mint of cancelSwapStore.swapState.mintsOfferee) {
                const ataOfferor = await getAssociatedTokenAddress(mint, offerorPubKey)
                const ataOfferee = await getAssociatedTokenAddress(mint, wallet.publicKey)
                try {
                    await getAccount(connection, ataOfferor, 'finalized')
                } catch (error) {
                    if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
                        txn.add(createAssociatedTokenAccountInstruction(
                            wallet.publicKey,
                            ataOfferor,
                            offerorPubKey,
                            mint
                        ))
                    }
                }

                txn.add(await transferNftFromOffereeToOfferorInstruction({
                    connection,
                    wallet: wallet as any,
                    swapState: cancelSwapStore.swapStatePubKey,
                    offeror: offerorPubKey,
                    offeree: wallet.publicKey,
                    mint,
                    ataOfferor,
                    ataOfferee
                }))
            }

            txn.add(await acceptSwapInstruction({
                connection,
                wallet: wallet as any,
                swapState: cancelSwapStore.swapStatePubKey,
                offeror: offerorPubKey,
                offeree: wallet.publicKey,
                offerorState,
                offereeState
            }))
            await wallet.sendTransaction(txn, connection)
            setLoadingStatus('finished')
        } catch (error) {
            setLoadingStatus('failed')
        }
    }

    const handleClick = () => type === 'cancel' ? cancelSwap() : acceptSwap()

    if (loadingStatus === 'finished') {
        return <Layout>
            <h1 className='text-2xl mb-6'>Swap NFT</h1>
            <div className='flex flex-col items-center'>
                <CheckIcon />
                <div className='text-lg'>
                    {type === 'cancel' ? 'Success, swap has been cancelled.' : 'Success, swap has been completed.'}
                </div>
            </div>
        </Layout>
    }

    return <Layout>
        <h1 className='text-2xl mb-6'>Swap NFT</h1>
        {isLoading && <Skeleton />}
        {type === 'cancel' ? (
            <>
                {cancelSwapStore.offerorNfts.length > 0 && (
                    <div className='mt-10'>
                        <div>Your offers</div>
                        <NftsGrid nfts={cancelSwapStore.offerorNfts} />
                    </div>
                )}
                {cancelSwapStore.offereeNfts.length > 0 && (
                    <div className='mt-10'>
                        <div>You are supposed to receive</div>
                        <NftsGrid nfts={cancelSwapStore.offereeNfts} />
                    </div>
                )}
            </>
        ) : (
            <>
                {cancelSwapStore.offereeNfts.length > 0 && (
                    <div className='mt-10'>
                        <div>You will send</div>
                        <NftsGrid nfts={cancelSwapStore.offereeNfts} />
                    </div>
                )}
                {cancelSwapStore.offerorNfts.length > 0 && (
                    <div className='mt-10'>
                        <div>You will receive</div>
                        <NftsGrid nfts={cancelSwapStore.offerorNfts} />
                    </div>
                )}
            </>
        )}
        {loadingStatus === 'failed' && (
            <div className='text-red-500'>Error, please try again.</div>
        )}
        <button
            onClick={handleClick}
            className={`${loadingStatus === 'loading' ? 'bg-gray-500 cursor-not-allowed' : 'bg-zinc-900 hover:bg-zinc-700 cursor-pointer'} text-green-100 w-full rounded py-2 mt-6`}
        >
            {type === 'cancel' ? 'Cancel swap' : 'Accept swap'}
        </button>
    </Layout>
})