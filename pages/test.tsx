import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'

const Test = () => {
    const { connection } = useConnection()
    const { publicKey, sendTransaction } = useWallet()

    const sendSol = async () => {
        if (!publicKey) return

        const txn = new Transaction()
        txn.add(SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey('oEkvFgLAU1Zhr9WCtiFADzeEkyU6YhkASsKpUDLTfAD'),
            lamports: 0.01 * LAMPORTS_PER_SOL
        }))
        const signature = await sendTransaction(txn, connection)
        console.log(signature)
    }

    return <div>
        <button>send 0.01 sol</button>
    </div>
}

export default Test