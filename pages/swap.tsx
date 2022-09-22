import { observer } from 'mobx-react-lite'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { Layout } from '../components/Layout'
import { swapStore } from '../stores/SwapStore'
import { SwapStepOne } from '../components/SwapStepOne'
import { SwapStepTwo } from '../components/SwapStepTwo'
import { SwapStepThree } from '../components/SwapStepThree'
import { useEffect } from 'react'
import { Skeleton } from '../components/Skeleton'
import { CancelSwap } from '../components/CancelSwap'

const Swap = observer(() => {
    const wallet = useWallet()
    const { connection } = useConnection()

    useEffect(() => {
        if (!wallet || !wallet.publicKey) return
        swapStore.loadUserState(connection, wallet as any)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet])

    if (swapStore.isUserStateLoading) {
        return <Layout>
            <h1 className='text-2xl mb-6'>Swap NFT</h1>
            <Skeleton />
        </Layout>
    }

    if (swapStore.userState?.userEnum === 'offeror') {
        return <CancelSwap />
    }

    if (swapStore.userState?.userEnum === 'offeree') {
        return <Layout>
            <h1 className='text-2xl mb-6'>Swap NFT</h1>
            <div>Accept swap</div>
        </Layout>
    }

    return <Layout>
        <h1 className='text-2xl mb-6'>Swap NFT</h1>
        {swapStore.step === 'one' && <SwapStepOne />}
        {swapStore.step === 'two' && <SwapStepTwo />}
        {swapStore.step === 'three' && <SwapStepThree />}
    </Layout>
})

export default Swap