import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { Layout } from '../components/Layout'
import * as buffer from 'buffer'

const Test = () => {
    const { connection } = useConnection()
    const { publicKey, sendTransaction } = useWallet()

    const sendSol = async () => {
        window.Buffer = buffer.Buffer
        if (!publicKey) return

        const txn = new Transaction()
        txn.add(SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey('oEkvFgLAU1Zhr9WCtiFADzeEkyU6YhkASsKpUDLTfAD'),
            lamports: 0.01 * LAMPORTS_PER_SOL
        }))
        try {
            const signature = await sendTransaction(txn, connection)
            console.log(signature)
        } catch (error) {
            console.error('Error sending 0.01 sol: ', error)
        }
    }

    return <Layout>
        <button className='bg-zinc-900 text-zinc-300 p-4 rounded cursor-pointer' onClick={sendSol}>send 0.01 sol</button>
    </Layout>
}

export default Test