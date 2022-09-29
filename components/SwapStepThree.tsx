import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { observer } from 'mobx-react-lite'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import { swapStore } from '../stores/SwapStore'
import { NftsGrid } from '../components/NftCard'
import { addMintOffereeInstruction, initializeEscrowInstruction, initializeEscrowStateInstruction, initializeSwapStateInstruction, initializeUserStateInstruction, initiateSwapInstruction } from '../services/instructions'
import { getAnchorProgram, programId } from '../services/utils'
import { useState } from 'react'
import { CheckIcon } from './icons/CheckIcon'
import { ArrowLeftIcon } from './icons/ArrowLeftIcon'

const Spinner = () => (
    <div className="flex items-center justify-center ">
        <div className="w-16 h-16 border-b-2 border-gray-900 rounded-full animate-spin"></div>
    </div>
)

export const SwapStepThree = observer(() => {
    const wallet = useWallet()
    const { connection } = useConnection()

    const [loadingStatus, setLoadingStatus] = useState<'idle' | 'loading' | 'finished' | 'failed'>('idle')

    if (!wallet.publicKey) return <></>

    const initiateSwap = async () => {
        if (!wallet || !wallet.publicKey) return

        const program = getAnchorProgram(connection, wallet as any)

        setLoadingStatus('loading')
        const offereePubKey = new PublicKey(swapStore.loadedNftsWalletAddress)

        const [offerorPdaState, offerorPdaBump] = await PublicKey.findProgramAddress(
            [Buffer.from('user_state'), wallet.publicKey.toBuffer()], programId
        )
        const [offereePdaState, offereePdaBump] = await PublicKey.findProgramAddress(
            [Buffer.from('user_state'), offereePubKey.toBuffer()], programId
        )
        const [swapState, swapBump] = await PublicKey.findProgramAddress(
            [Buffer.from('swap_state'), wallet.publicKey.toBuffer(), offereePubKey.toBuffer()], programId
        )

        const txn = new Transaction()
        const offerorState = await program.account.userState.fetchNullable(offerorPdaState)
        if (!offerorState) {
            txn.add(await initializeUserStateInstruction({
                connection, wallet: wallet as any, bump: offerorPdaBump, userState: offerorPdaState, user: wallet.publicKey, userSeed: wallet.publicKey
            }))
        }

        const offereeState = await program.account.userState.fetchNullable(offereePdaState)
        if (!offereeState) {
            txn.add(await initializeUserStateInstruction({
                connection, wallet: wallet as any, bump: offereePdaBump, userState: offereePdaState, user: wallet.publicKey, userSeed: offereePubKey
            }))
        }

        const swapStatePda = await program.account.swapState.fetchNullable(swapState)
        if (!swapStatePda) {
            txn.add(await initializeSwapStateInstruction({
                connection,
                wallet: wallet as any,
                swapState,
                swapBump,
                offeror: wallet.publicKey,
                offeree: offereePubKey
            }))
        }

        for (const nft of swapStore.selectedNfts) {
            const mint = new PublicKey(nft.tokenAddress)
            txn.add(await addMintOffereeInstruction({
                connection,
                wallet: wallet as any,
                swapState,
                mint,
                offeror: wallet.publicKey,
                offeree: offereePubKey
            }))
        }

        for (const nft of swapStore.offerorSelectedNfts) {
            const mint = new PublicKey(nft.tokenAddress)
            const [escrowState, escrowStateBump] = await PublicKey.findProgramAddress(
                [Buffer.from('escrow_state'), wallet.publicKey.toBuffer(), mint.toBuffer()], programId
            )
            const [escrow, escrowBump] = await PublicKey.findProgramAddress(
                [Buffer.from('escrow'), wallet.publicKey.toBuffer(), mint.toBuffer()], programId
            )
            const escrowStatePda = await program.account.escrowState.fetchNullable(escrowState)
            if (!escrowStatePda) {
                txn.add(await initializeEscrowStateInstruction({
                    connection,
                    wallet: wallet as any,
                    escrowState,
                    escrowStateBump,
                    mint,
                    offeror: wallet.publicKey
                }))
            }

            const ataOfferor = await getAssociatedTokenAddress(mint, wallet.publicKey)
            txn.add(await initializeEscrowInstruction({
                connection,
                wallet: wallet as any,
                swapState,
                escrowState,
                escrow,
                escrowAtaBump: escrowBump,
                mint,
                ataOfferor,
                offeror: wallet.publicKey,
                offeree: offereePubKey
            }))
        }

        txn.add(await initiateSwapInstruction({
            connection,
            wallet: wallet as any,
            swapState,
            offeror: wallet.publicKey,
            offeree: offereePubKey,
            offerorState: offerorPdaState,
            offereeState: offereePdaState
        }))
        txn.add(SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey('oEkvFgLAU1Zhr9WCtiFADzeEkyU6YhkASsKpUDLTfAD'),
            lamports: 0.01 * LAMPORTS_PER_SOL
        }))
        try {
            await wallet.sendTransaction(txn, connection)
            setLoadingStatus('finished')
        } catch (error) {
            setLoadingStatus('failed')
        }
    }

    const goToPrevStep = () => swapStore.setStep('two')

    if (loadingStatus === 'finished') {
        return <div className='flex flex-col items-center'>
            <CheckIcon />
            <div className='text-lg'>Success, now wait for counter party to accept the swap.</div>
            <div className='text-lg'>Or refresh to cancel the swap.</div>
        </div>
    }

    return <div>
        <div>
            <button onClick={goToPrevStep} className='flex gap-2 bg-gray-200 hover:bg-gray-300 rounded p-4'>
                <ArrowLeftIcon /> Back
            </button>
        </div>
        <div className='flex flex-col gap-2'>
            {swapStore.offerorSelectedNfts.length > 0 && (
                <div className='mt-10'>
                    <div>Your offer</div>
                    <NftsGrid nfts={swapStore.offerorSelectedNfts} />
                </div>
            )}
            {swapStore.selectedNfts.length > 0 && (
                <div className='mt-10'>
                    <div>You will receive</div>
                    <NftsGrid nfts={swapStore.selectedNfts} />
                </div>
            )}
            {loadingStatus === 'loading' && <Spinner />}
            {loadingStatus === 'failed' && (
                <div className='text-red-500'>Failed, please try again.</div>
            )}
            <button
                className={`${loadingStatus === 'loading' ? 'bg-gray-500 cursor-not-allowed' : 'bg-zinc-900 hover:bg-zinc-700 cursor-pointer'} text-green-100 w-full rounded py-2 mt-6`}
                onClick={initiateSwap}
                disabled={loadingStatus === 'loading'}
            >
                Initiate swap
            </button>
        </div>
    </div>
})