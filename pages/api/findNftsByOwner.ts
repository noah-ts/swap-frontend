import { NextApiRequest, NextApiResponse } from 'next'
import { PublicKey } from '@solana/web3.js'
import { NftType } from '../../types/NftType'

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ data?: NftType[], message?: string }>) {
    const API_KEY = process.env.HELIUS_API_KEY
    if (!API_KEY) {
        res.status(500).json({ message: 'No API key' })
        return
    }
    
    const owner = req.query.owner
    if (!owner) {
        res.status(400).json({ message: 'Owner is required' })
        return
    }

    try {
        new PublicKey(owner)
    } catch (error) {
        res.status(400).json({ message: 'Invalid owner address' })
        return
    }

    const resp = await fetch(`https://api.helius.xyz/v0/addresses/${owner}/nfts?api-key=${API_KEY}`)
    if (resp.status !== 200) {
        res.status(400).json({ message: 'Helius error' })
        return
    }
    const data = await resp.json()
    res.status(200).json({ data })
}