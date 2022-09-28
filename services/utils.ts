import { AnchorProvider, Program, Wallet } from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import idl from '../bsl_swap.json'
import { BslSwap } from '../types/bsl_swap'

// export const programId = new PublicKey(idl.metadata.address)
export const programId = new PublicKey('FLjoHCAmjojgt7DUxid7WR9EyEj2Pysq9cMehRiM5vtp')
let program: Program<BslSwap>

export const getAnchorProgram = (connection: Connection, wallet: Wallet) => {
    if (program) return program
    const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'processed' })
    program = new Program(idl as any, programId, provider)
    return program
}
