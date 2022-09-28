import { PublicKey } from '@solana/web3.js'

export type SwapStateType = {
    offeror: PublicKey
    offeree: PublicKey
    mintsOfferor: PublicKey[]
    mintsOfferee: PublicKey[]
}