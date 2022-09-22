import { observer } from 'mobx-react-lite'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { Layout } from './Layout'
import { useEffect, useState } from 'react'
import { LoadingStatusType } from '../types/LoadingStatusType'
import { customGetOrCreateAssociatedTokenAccount, programId } from '../services/utils'
import { swapStore } from '../stores/SwapStore'
import { cancelSwapTransaction } from '../services/transactions'
import { cancelSwapStore } from '../stores/CancelSwapStore'
import { NftsGrid } from './NftCard'
import { CheckIcon } from './icons/CheckIcon'

export const CancelSwap = observer(() => {
    const wallet = useWallet()
    const { connection } = useConnection()

    const loadData = async () => {
        await loadSwapState()
        await loadMints()
    }

    const loadSwapState = async () => {
        if (!swapStore.userState?.counterParty) return
        await cancelSwapStore.loadSwapState(connection, wallet as any, swapStore.userState?.counterParty)
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
                [Buffer.from('escrow'), wallet.publicKey.toBuffer(), offereePubKey.toBuffer()], programId
            )

            const ataOfferorAssetAAccount = await customGetOrCreateAssociatedTokenAccount(
                connection,
                wallet.publicKey,
                cancelSwapStore.swapState.mintAssetA,
                wallet.publicKey,
                wallet.sendTransaction,
                false,
                'finalized'
            )
            if (!ataOfferorAssetAAccount) return
            const ataOfferorAssetA = ataOfferorAssetAAccount.address

            const txn = await cancelSwapTransaction({
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
            await wallet.sendTransaction(txn, connection)
            setLoadingStatus('finished')
        } catch (error) {
            setLoadingStatus('failed')
        }
    }

    if (loadingStatus === 'finished') {
        return <div className='h-screen flex flex-col items-center'>
            <CheckIcon />
            <div className='text-lg'>Success, swap has been cancelled.</div>
        </div>
    }

    return <Layout>
        <h1 className='text-2xl mb-6'>Swap NFT</h1>
        {cancelSwapStore.offerorNft && (
            <div className='mt-10'>
                <div>Your offer</div>
                <NftsGrid nfts={[cancelSwapStore.offerorNft]} />
            </div>
        )}
        {cancelSwapStore.offereeNft && (
            <div className='mt-10'>
                <div>You are supposed to receive</div>
                <NftsGrid nfts={[cancelSwapStore.offereeNft]} />
            </div>
        )}
        <button
            onClick={cancelSwap}
            className={`${loadingStatus === 'loading' ? 'bg-gray-500 cursor-not-allowed' : 'bg-zinc-900 hover:bg-zinc-700 cursor-pointer'} text-green-100 w-full rounded py-2 mt-6`}
        >
            Cancel swap
        </button>
    </Layout>
})