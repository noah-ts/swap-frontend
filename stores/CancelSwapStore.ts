import { makeObservable, observable, action, runInAction } from 'mobx'
import { Wallet } from '@project-serum/anchor'
import { PublicKey, Connection } from '@solana/web3.js'
import { NftType } from '../types/NftType'
import { getAnchorProgram, programId } from '../services/utils'
import { SwapStateType } from '../types/SwapStateType'

class CancelSwapStore {
    swapState: SwapStateType | null = null
    swapStatePubKey: PublicKey | null = null
    offerorNft: NftType | null = null
    offereeNft: NftType | null = null

    constructor() {
        makeObservable(this, {
            swapState: observable,
            swapStatePubKey: observable,
            loadSwapState: action,

            offerorNft: observable,
            offereeNft: observable
        })
    }

    loadSwapState = async (connection: Connection, wallet: Wallet, offerorPubKey: PublicKey, offereePubKey: PublicKey) => {
        const program = getAnchorProgram(connection, wallet as any)
        const [swapState] = await PublicKey.findProgramAddress(
            [Buffer.from('swap_state'), offerorPubKey.toBuffer(), offereePubKey.toBuffer()], programId
        )
        this.swapStatePubKey = swapState
        const swapStatePda = await program.account.swapState.fetchNullable(swapState)
        if (swapStatePda) {
            this.swapState = swapStatePda
        }
    }

    loadMints = async (mints: string[]) => {
        try {
            const res = await fetch('/api/findNftsByMints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mints })
            })
            const data = await res.json()
            if (res.status !== 200) {
                console.error(data.message || 'Error loading mints')
            } else {
                runInAction(() => {
                    const offerorNft = data.data[0]
                    this.offerorNft = {
                        tokenAddress: offerorNft?.mint,
                        imageUrl: offerorNft?.offChainData?.image,
                        name: offerorNft?.offChainData?.name
                    }
                    const offereeNft = data.data[1]
                    this.offereeNft = {
                        tokenAddress: offereeNft?.mint,
                        imageUrl: offereeNft?.offChainData?.image,
                        name: offereeNft?.offChainData?.name
                    }
                })
            }
        } catch (error) {
            console.error(error)
        }
    }
}

export const cancelSwapStore = new CancelSwapStore()