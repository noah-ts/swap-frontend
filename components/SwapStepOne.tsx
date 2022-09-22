import { useForm } from 'react-hook-form'
import { PublicKey } from '@solana/web3.js'
import { observer } from 'mobx-react-lite'
import { useWallet } from '@solana/wallet-adapter-react'
import { swapStore } from '../stores/SwapStore'
import { NftsByCollection, NftsGrid } from '../components/NftCard'
import { Skeleton } from '../components/Skeleton'

export const SwapStepOne = observer(() => {
    const { publicKey } = useWallet()
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<{ walletAddress: string }>()

    const onSubmit = handleSubmit(async data => {
        if (!publicKey) {
            alert('Please connect your wallet.')
            return
        }
        await swapStore.loadNfts(data.walletAddress)
        if (!swapStore.errorLoadingNfts) {
            setValue('walletAddress', '')
        }
    })

    const goToNextStep = () => swapStore.setStep('two')

    return <div>
        <div className='flex flex-col gap-2'>
            <h3 className='text-lg'>Enter counter party wallet address</h3>
            <form onSubmit={onSubmit}>
                <input
                    {...register('walletAddress', { required: true, validate: value => {
                        try {
                            new PublicKey(value)
                        } catch (error) {
                            return 'Invalid wallet address'
                        }
                    } })}
                    className='px-4 py-2 rounded bg-green-100 w-full text-sm md:text-base'
                    placeholder='Wallet address'
                />
                {errors.walletAddress && <span className='text-red-500'>{errors.walletAddress.message || 'Wallet address is required'}</span>}
                <button
                    type='submit'
                    className='bg-zinc-900 hover:bg-zinc-700 text-green-100 w-full rounded py-2 mt-6'
                    disabled={swapStore.isNftsLoading}
                >
                    Load NFTs
                </button>
            </form>
            {swapStore.errorLoadingNfts && (
                <div className='text-red-500'>{swapStore.errorLoadingNfts}</div>
            )}
            {!swapStore.loadedNftsWalletAddress && !swapStore.isNftsLoading && <div className='h-screen'></div>}
            {swapStore.isNftsLoading && <Skeleton />}
            {swapStore.loadedNftsWalletAddress && !swapStore.errorLoadingNfts && (
                <div className='mt-10 mb-4 text-sm md:text-base'>{swapStore.loadedNftsWalletAddress}</div>
            )}
            {swapStore.nfts.length > 0 && <NftsByCollection nftsByCollection={swapStore.nftsByCollection} />}
            {swapStore.selectedNft && (
                <div className='mt-10'>
                    <div className='mb-4'>Selected NFT</div>
                    <NftsGrid nfts={[swapStore.selectedNft]} />
                    <button
                        className='bg-zinc-900 hover:bg-zinc-700 text-green-100 w-full rounded py-2 mt-6'
                        onClick={goToNextStep}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    </div>
})