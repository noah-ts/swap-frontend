import { makeObservable, observable, action, computed } from 'mobx'
import { PublicKey, Connection } from '@solana/web3.js'
import { Wallet } from '@project-serum/anchor'
import { NftsByCollectionType } from '../types/NftsByCollection'
import { NftType } from '../types/NftType'
import { getAnchorProgram, programId } from '../services/utils'

export type StepType = 'one' | 'two' | 'three'

class SwapStore {
    step: StepType = 'one'

    loadedNftsWalletAddress: string = ''
    nfts: NftType[] = []
    errorLoadingNfts: string = ''
    isNftsLoading: boolean = false

    offerorNfts: NftType[] = []
    offerorErrorLoadingNfts: string = ''
    offerorIsNftsLoading: boolean = false

    isUserStateLoading: boolean = false
    userState: { counterParty: PublicKey, userEnum: 'offeror' | 'offeree' | 'none' } | null = null

    constructor() {
        makeObservable(this, {
            step: observable,
            setStep: action,

            loadedNftsWalletAddress: observable,
            nfts: observable,
            selectedNfts: computed,
            errorLoadingNfts: observable,
            isNftsLoading: observable,
            nftsByCollection: computed,
            setSelectedNft: action,
            loadNfts: action,

            offerorNfts: observable,
            offerorSelectedNfts: computed,
            offerorErrorLoadingNfts: observable,
            offerorIsNftsLoading: observable,
            offerorNftsByCollection: computed,
            loadOfferorNfts: action,

            isUserStateLoading: observable,
            userState: observable,
            loadUserState: action
        })
    }

    get nftsByCollection(): NftsByCollectionType {
        const obj: Record<string, NftType[]> = {}
        this.nfts.forEach(nft => {
            if (!nft.collectionAddress) return
            const collection = obj[nft.collectionAddress]
            if (collection) {
                obj[nft.collectionAddress].push(nft)
            } else {
                obj[nft.collectionAddress] = [nft]
            }
        })
        return obj
    }

    get offerorNftsByCollection(): NftsByCollectionType {
        const obj: Record<string, NftType[]> = {}
        this.offerorNfts.forEach(nft => {
            if (!nft.collectionAddress) return
            const collection = obj[nft.collectionAddress]
            if (collection) {
                obj[nft.collectionAddress].push(nft)
            } else {
                obj[nft.collectionAddress] = [nft]
            }
        })
        return obj
    }

    get selectedNfts() {
        return this.nfts.filter(n => n.isSelected)
    }

    get offerorSelectedNfts() {
        return this.offerorNfts.filter(n => n.isSelected)
    }

    setStep = (step: StepType) => {
        this.step = step
    }

    setSelectedNft = (nft: NftType) => {
        if (this.step === 'one') {
            this.nfts = this.nfts.map(n => {
                if (n.tokenAddress === nft.tokenAddress) {
                    if ((this.selectedNfts.length + this.offerorSelectedNfts.length) >= 6) {
                        return { ...n, isSelected: false }
                    }
                    return { ...n, isSelected: !n.isSelected }
                }
                return n
            })
        } else if (this.step === 'two') {
            this.offerorNfts = this.offerorNfts.map(n => {
                if (n.tokenAddress === nft.tokenAddress) {
                    if ((this.selectedNfts.length + this.offerorSelectedNfts.length) >= 6) {
                        return { ...n, isSelected: false }
                    }
                    return { ...n, isSelected: !n.isSelected }
                }
                return n
            })
        }
    }

    loadNfts = async (walletAddress: string) => {
        try {
            this.isNftsLoading = true
            const res = await fetch(`/api/findNftsByOwner?owner=${walletAddress}`)
            const data: { data?: { nfts: NftType[] }, message?: string } = await res.json()
            if (res.status !== 200 || !data.data) {
                this.errorLoadingNfts = data.message || 'Error loading NFTs, please try again.'
                this.nfts = []
            } else {
                this.errorLoadingNfts = ''
                this.loadedNftsWalletAddress = walletAddress
                this.nfts = data.data.nfts.filter(nft => nft.imageUrl.includes('https://arweave.net') || nft.imageUrl.includes('https://www.arweave.net') || nft.imageUrl.includes('https://nftstorage.link') || nft.imageUrl.includes('https://www.nftstorage.link'))
            }
        } catch (error) {
            this.errorLoadingNfts = 'Error loading NFTs, please try again.'
            this.nfts = []
        } finally {
            this.isNftsLoading = false
        }
    }

    loadOfferorNfts = async (walletAddress: string) => {
        try {
            this.offerorIsNftsLoading = true
            const res = await fetch(`/api/findNftsByOwner?owner=${walletAddress}`)
            const data: { data?: { nfts: NftType[] }, message?: string } = await res.json()
            if (res.status !== 200 || !data.data) {
                this.offerorErrorLoadingNfts = data.message || 'Error loading NFTs, please try again.'
                this.offerorNfts = []
            } else {
                this.offerorErrorLoadingNfts = ''
                this.offerorNfts = data.data.nfts.filter(nft => nft.imageUrl.includes('arweave.net') || nft.imageUrl.includes('nftstorage.link'))
            }
        } catch (error) {
            this.offerorErrorLoadingNfts = 'Error loading NFTs, please try again.'
            this.nfts = []
        } finally {
            this.offerorIsNftsLoading = false
        }
    }

    loadUserState = async (connection: Connection, wallet: Wallet) => {
        try {
            this.isUserStateLoading = true
            const program = getAnchorProgram(connection, wallet as any)
            const [userPdaState] = await PublicKey.findProgramAddress(
                [Buffer.from('user_state'), wallet.publicKey.toBuffer()], programId
            )
            const state = await program.account.userState.fetch(userPdaState)
            const userEnum = (() => {
                if (state.userEnum === 1) return 'offeror'
                if (state.userEnum === 2) return 'offeree'
                return 'none'
            })()
            this.userState = {
                counterParty: state.counterParty,
                userEnum
            }
        } catch (error) {
            console.error(error)
        } finally {
            this.isUserStateLoading = false
        }
    }
}

export const swapStore = new SwapStore()