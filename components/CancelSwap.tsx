import { observer } from 'mobx-react-lite'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddress, getAccount, TokenInvalidAccountOwnerError, TokenAccountNotFoundError, createAssociatedTokenAccountInstruction } from '@solana/spl-token'
import { Layout } from './Layout'
import { FC, useEffect, useState } from 'react'
import { LoadingStatusType } from '../types/LoadingStatusType'
import { programId } from '../services/utils'
import { swapStore } from '../stores/SwapStore'
import { acceptSwapTransaction, cancelSwapInstruction } from '../services/instructions'
import { cancelSwapStore } from '../stores/CancelSwapStore'
import { NftsGrid } from './NftCard'
import { CheckIcon } from './icons/CheckIcon'
import { Skeleton } from './Skeleton'

export const CancelSwap: FC<{ type: 'cancel' | 'accept' }> = observer(({ type }) => {
    const wallet = useWallet()
    const { connection } = useConnection()

    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

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

    const loadMints = async () => {
        if (!cancelSwapStore.swapState?.mintAssetA ||
            !cancelSwapStore.swapState?.mintAssetB
        ) return
        await cancelSwapStore.loadMints([cancelSwapStore.swapState?.mintAssetA.toString(), cancelSwapStore.swapState?.mintAssetB.toString()])
    }

    useEffect(() => {
        loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>('idle')

    const cancelSwap = async () => {
        if (!wallet.publicKey ||
            !swapStore.userState?.counterParty||
            !cancelSwapStore.swapState?.mintAssetA ||
            !cancelSwapStore.swapState?.mintAssetB ||
            !cancelSwapStore.swapStatePubKey
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
            const [escrow] = await PublicKey.findProgramAddress(
                [Buffer.from('escrow'), wallet.publicKey.toBuffer(), cancelSwapStore.swapState.mintAssetA.toBuffer()], programId
            )

            const ataOfferorAssetA = await getAssociatedTokenAddress(cancelSwapStore.swapState.mintAssetA, wallet.publicKey)

            const txn = new Transaction().add(
                await cancelSwapInstruction({
                    connection,
                    wallet: wallet as any,
                    swapState: cancelSwapStore.swapStatePubKey,
                    escrow,
                    mintAssetA: cancelSwapStore.swapState.mintAssetA,
                    offeror: wallet.publicKey,
                    offeree: offereePubKey,
                    mintAssetB: cancelSwapStore.swapState.mintAssetB,
                    offerorState,
                    offereeState,
                    ataOfferorAssetA
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
            !cancelSwapStore.swapState?.mintAssetA ||
            !cancelSwapStore.swapState?.mintAssetB ||
            !cancelSwapStore.swapStatePubKey
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
            const [escrow] = await PublicKey.findProgramAddress(
                [Buffer.from('escrow'), offerorPubKey.toBuffer(), cancelSwapStore.swapState.mintAssetA.toBuffer()], programId
            )

            const txn = new Transaction()
            const ataOffereeAssetB = await getAssociatedTokenAddress(cancelSwapStore.swapState.mintAssetB, wallet.publicKey)

            const ataOffereeAssetA = await getAssociatedTokenAddress(cancelSwapStore.swapState.mintAssetA, wallet.publicKey)
            try {
                await getAccount(connection, ataOffereeAssetA, 'finalized')
            } catch (error) {
                if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
                    txn.add(createAssociatedTokenAccountInstruction(
                        wallet.publicKey,
                        ataOffereeAssetA,
                        wallet.publicKey,
                        cancelSwapStore.swapState.mintAssetA
                    ))
                }
            }

            const ataOfferorAssetB = await getAssociatedTokenAddress(cancelSwapStore.swapState.mintAssetB, offerorPubKey)
            try {
                await getAccount(connection, ataOfferorAssetB, 'finalized')
            } catch (error) {
                if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
                    txn.add(createAssociatedTokenAccountInstruction(
                        wallet.publicKey,
                        ataOfferorAssetB,
                        offerorPubKey,
                        cancelSwapStore.swapState.mintAssetB
                    ))
                }
            }

            txn.add(await acceptSwapTransaction({
                connection,
                wallet: wallet as any,
                swapState: cancelSwapStore.swapStatePubKey,
                escrow,
                mintAssetA: cancelSwapStore.swapState.mintAssetA,
                offeror: offerorPubKey,
                offeree: wallet.publicKey,
                mintAssetB: cancelSwapStore.swapState.mintAssetB,
                offerorState,
                offereeState,
                ataOffereeAssetA,
                ataOfferorAssetB,
                ataOffereeAssetB
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
                {cancelSwapStore.offerorNft && cancelSwapStore.offerorNft.imageUrl && (
                    <div className='mt-10'>
                        <div>Your offer</div>
                        <NftsGrid nfts={[cancelSwapStore.offerorNft]} />
                    </div>
                )}
                {cancelSwapStore.offereeNft && cancelSwapStore.offereeNft.imageUrl && (
                    <div className='mt-10'>
                        <div>You are supposed to receive</div>
                        <NftsGrid nfts={[cancelSwapStore.offereeNft]} />
                    </div>
                )}
            </>
        ) : (
            <>
                {cancelSwapStore.offereeNft && cancelSwapStore.offereeNft.imageUrl && (
                    <div className='mt-10'>
                        <div>Your will send</div>
                        <NftsGrid nfts={[cancelSwapStore.offereeNft]} />
                    </div>
                )}
                {cancelSwapStore.offerorNft && cancelSwapStore.offerorNft.imageUrl && (
                    <div className='mt-10'>
                        <div>Your will receive</div>
                        <NftsGrid nfts={[cancelSwapStore.offerorNft]} />
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
        <div className='text-sm'>(Please refresh if you do not see both nfts.)</div>
    </Layout>
})