import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { observer } from 'mobx-react-lite'
import { PublicKey, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import { swapStore } from '../stores/SwapStore'
import { NftsGrid } from '../components/NftCard'
import { initializeEscrowInstruction, initializeSwapStateInstruction, initializeUserStateInstruction, initiateSwapInstruction } from '../services/instructions'
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
        if (!wallet || !wallet.publicKey || !swapStore.offerorSelectedNft?.tokenAddress || !swapStore.selectedNft?.tokenAddress) return

        const program = getAnchorProgram(connection, wallet as any)

        setLoadingStatus('loading')
        const offereePubKey = new PublicKey(swapStore.loadedNftsWalletAddress)
        const mintAssetA = new PublicKey(swapStore.offerorSelectedNft?.tokenAddress)
        const mintAssetB = new PublicKey(swapStore.selectedNft?.tokenAddress)
        const ataOfferorAssetA = await getAssociatedTokenAddress(mintAssetA, wallet.publicKey)

        const [offerorPdaState, offerorPdaBump] = await PublicKey.findProgramAddress(
            [Buffer.from('user_state'), wallet.publicKey.toBuffer()], programId
        )
        const [offereePdaState, offereePdaBump] = await PublicKey.findProgramAddress(
            [Buffer.from('user_state'), offereePubKey.toBuffer()], programId
        )
        const [swapState, swapBump] = await PublicKey.findProgramAddress(
            [Buffer.from('swap_state'), wallet.publicKey.toBuffer(), offereePubKey.toBuffer()], programId
        )
        const [escrow, escrowBump] = await PublicKey.findProgramAddress(
            [Buffer.from('escrow'), wallet.publicKey.toBuffer(), mintAssetA.toBuffer()], programId
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

        txn.add(await initializeEscrowInstruction({
            connection,
            wallet: wallet as any,
            swapState,
            escrow,
            escrowBump,
            mintAssetA,
            offeror: wallet.publicKey,
            offeree: offereePubKey
        }))

        txn.add(await initiateSwapInstruction({
            connection,
            wallet: wallet as any,
            swapState,
            escrow,
            mintAssetA,
            offeror: wallet.publicKey,
            offeree: offereePubKey,
            mintAssetB,
            ataOfferorAssetA,
            offerorState: offerorPdaState,
            offereeState: offereePdaState
        }))
        try {
            console.log(txn.instructions.length)
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
            {swapStore.offerorSelectedNft && (
                <div className='mt-10'>
                    <div>Your offer</div>
                    <NftsGrid nfts={[swapStore.offerorSelectedNft]} />
                </div>
            )}
            {swapStore.selectedNft && (
                <div className='mt-10'>
                    <div>You will receive</div>
                    <NftsGrid nfts={[swapStore.selectedNft]} />
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