import { makeObservable, observable, action, runInAction } from 'mobx'
import { Wallet } from '@project-serum/anchor'
import { PublicKey, Connection } from '@solana/web3.js'
import { NftType } from '../types/NftType'
import { getAnchorProgram, programId } from '../services/utils'
import { SwapStateType } from '../types/SwapStateType'

class CancelSwapStore {
    swapState: SwapStateType | null = null
    swapStatePubKey: PublicKey | null = null
    offerorNfts: NftType[] = []
    offereeNfts: NftType[] = []

    constructor() {
        makeObservable(this, {
            swapState: observable,
            swapStatePubKey: observable,
            loadSwapState: action,

            offerorNfts: observable,
            offereeNfts: observable,
            loadMintsOfferor: action,
            loadMintsOfferee: action
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

    loadMints = async (currentUserAddress: string) => {
        if (!this.swapState) return
        if (this.swapState.offeror.toString() === currentUserAddress) {
            await this.loadMintsOfferor()
        } else {
            await this.loadMintsOfferee()
        }
    }

    loadMintsOfferor = async () => {
        if (!this.swapState) return
        try {
            const res = await fetch('/api/findNftsByMints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mints: this.swapState.mintsOfferor.map(m => m.toString()) })
            })
            const data = await res.json()
            if (res.status !== 200) {
                console.error(data.message || 'Error loading mints')
            } else {
                runInAction(() => {
                    data.data.forEach((value: any) => {
                        this.offerorNfts.push({
                            tokenAddress: value?.mint,
                            imageUrl: value?.offChainData?.image,
                            name: value?.offChainData?.name
                        })
                    })
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    loadMintsOfferee = async () => {
        if (!this.swapState) return
        try {
            const res = await fetch('/api/findNftsByMints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mints: this.swapState.mintsOfferee.map(m => m.toString()) })
            })
            const data = await res.json()
            if (res.status !== 200) {
                console.error(data.message || 'Error loading mints')
            } else {
                runInAction(() => {
                    data.data.forEach((value: any) => {
                        this.offereeNfts.push({
                            tokenAddress: value?.mint,
                            imageUrl: value?.offChainData?.image,
                            name: value?.offChainData?.name
                        })
                    })
                })
            }
        } catch (error) {
            console.error(error)
        }
    }
}

export const cancelSwapStore = new CancelSwapStore()