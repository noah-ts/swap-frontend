export type NftType = {
    collectionAddress?: string
    collectionName?: string
    imageUrl: string
    name: string
    tokenAddress: string
    traits?: Trait[]
    isSelected?: boolean
}

type Trait = {
    trait_type: string
    value: string
}

export type MintOffChainData = {
    name: string
    image: string
}