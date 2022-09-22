import { useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { observer } from 'mobx-react-lite'
import { Layout } from '../components/Layout'
import { swapStore } from '../stores/SwapStore'
import { NftsByCollection, NftsGrid } from '../components/NftCard'
import { Skeleton } from '../components/Skeleton'

export const SwapStepTwo = observer(() => {
    const { publicKey } = useWallet()
    if (!publicKey) return <Layout><></></Layout>

    const loadData = () => swapStore.loadOfferorNfts(publicKey.toString())

    const goToNextStep = () => swapStore.setStep('three')

    useEffect(() => {
        loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div>
        <div className='flex flex-col gap-2'>
            {swapStore.offerorErrorLoadingNfts && (
                <div>
                    <div className='text-red-500'>{swapStore.offerorErrorLoadingNfts}</div>
                    <button
                        className='bg-zinc-900 hover:bg-zinc-700 text-green-100 rounded py-2 mt-6'
                        onClick={loadData}
                    >
                        Try again
                    </button>
                </div>
            )}
            {swapStore.offerorIsNftsLoading && <Skeleton />}
            {!swapStore.offerorErrorLoadingNfts && (
                <div>
                    <div className='mt-10 text-sm md:text-base'>{publicKey.toString()}</div>
                    <div>Choose your NFT</div>
                </div>
            )}
            {swapStore.offerorNfts.length > 0 && <NftsByCollection nftsByCollection={swapStore.offerorNftsByCollection} />}
            {swapStore.offerorSelectedNft && (
                <div className='mt-10'>
                    <div>Selected NFT</div>
                    <NftsGrid nfts={[swapStore.offerorSelectedNft]} />
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