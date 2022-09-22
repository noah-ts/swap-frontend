import { PublicKey } from '@solana/web3.js'

export type SwapStateType = {
    offeror: PublicKey
    offeree: PublicKey
    mintAssetA: PublicKey
    mintAssetB: PublicKey
    escrow: PublicKey
}