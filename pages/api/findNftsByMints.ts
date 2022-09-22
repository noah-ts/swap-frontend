import { NextApiRequest, NextApiResponse } from 'next'
import { NftType } from '../../types/NftType'

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ data?: NftType[], message?: string }>) {
    if (req.method !== 'POST') return

    const API_KEY = process.env.HELIUS_API_KEY
    if (!API_KEY) {
        res.status(500).json({ message: 'No API key' })
        return
    }
    
    const mints: string[] = req.body.mints
    if (!mints) {
        res.status(400).json({ message: 'Mints are required' })
        return
    }

    if (!Array.isArray(mints)) {
        res.status(400).json({ message: 'Invalid mints type' })
        return
    }

    const resp = await fetch(`https://api.helius.xyz/v0/tokens/metadata?api-key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mintAccounts: mints })
    })
    if (resp.status !== 200) {
        res.status(400).json({ message: 'Helius error' })
        return
    }
    const data = await resp.json()
    res.status(200).json({ data })
}