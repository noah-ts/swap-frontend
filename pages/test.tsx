import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { Layout } from '../components/Layout'

const Test = () => {
    const { connection } = useConnection()
    const { publicKey, sendTransaction, signTransaction } = useWallet()

    const sendSol = async () => {
        if (!publicKey) return
        if (!signTransaction) return

        const txn = new Transaction()
        txn.add(SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey('oEkvFgLAU1Zhr9WCtiFADzeEkyU6YhkASsKpUDLTfAD'),
            lamports: 0.01 * LAMPORTS_PER_SOL
        }))
        try {
            const { blockhash } = await connection.getLatestBlockhash()
            txn.recentBlockhash = blockhash
            txn.feePayer = publicKey
            const signed = await signTransaction(txn)
            const signature = await connection.sendRawTransaction(signed.serialize())
            console.log(signature)
        } catch (error) {
            console.error('Error sending 0.01 sol: ', error)
        }
    }

    return <Layout>
        <button className='bg-zinc-900 text-zinc-300 p-4 rounded' onClick={sendSol}>send 0.01 sol</button>
    </Layout>
}

export default Test