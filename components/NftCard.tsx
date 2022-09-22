import { FC, useState } from 'react'
import { NftType } from '../types/NftType'
import Image from 'next/image'
import { observer } from 'mobx-react-lite'
import { swapStore } from '../stores/SwapStore'
import { NftsByCollectionType } from '../types/NftsByCollection'

const UpIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 cursor-pointer"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
)

const DownIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 cursor-pointer"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
)

export const NftsByCollection: FC<{ nftsByCollection: NftsByCollectionType }> = observer(({ nftsByCollection }) => {
    return <div className='flex flex-col gap-4'>
        {Object.keys(nftsByCollection).map(key => <Nfts key={key} nfts={nftsByCollection[key]} />)}
    </div>
})

export const Nfts: FC<{ nfts: NftType[] }> = observer(({ nfts }) => {
    const [isOpen, setIsOpen] = useState(true)
    const toggle = () => setIsOpen(!isOpen)

    const collectionName = nfts?.[0]?.collectionName

    return <div className='bg-green-100 p-4 rounded shadow flex flex-col gap-4'>
        <div className='flex justify-between cursor-pointer' onClick={toggle}>
            <div>{collectionName}</div>
            <div>
                {isOpen ? <UpIcon /> : <DownIcon />}
            </div>
        </div>
        {isOpen && <NftsGrid nfts={nfts} />}
    </div>
})

export const NftsGrid: FC<{ nfts: NftType[] }> = observer(({ nfts }) => {
    return <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {nfts.map(nft => (
            <NftCard key={nft.tokenAddress.toString()} nft={nft} />
        ))}
    </div>
})

export const NftCard: FC<{ nft: NftType }> = observer(({ nft }) => {
    const handleClick = () => {
        swapStore.setSelectedNft(nft)
    }

    const isSelected = () => (
        swapStore.selectedNft?.tokenAddress === nft.tokenAddress ||
        swapStore.offerorSelectedNft?.tokenAddress === nft.tokenAddress
    )

    return <div
        className={
            `${isSelected() ? 'bg-green-300' : 'bg-green-100 hover:bg-green-200'}
            flex flex-col items-center py-4 rounded shadow cursor-pointer`
        }
        onClick={handleClick}
    >
        <div>{nft.name}</div>
        <div className='my-3 h-64 w-64 relative z-10'>
            <Image
                alt={`NFT ${nft.name} image`}
                src={nft.imageUrl}
                layout='fill'
                className='rounded'
            />
        </div>
    </div>
})