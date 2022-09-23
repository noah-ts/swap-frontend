import { AnchorProvider, Program, Wallet } from '@project-serum/anchor'
import { Account, ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAccount, getAssociatedTokenAddress, TokenAccountNotFoundError, TokenInvalidAccountOwnerError, TokenInvalidMintError, TokenInvalidOwnerError, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { SendTransactionOptions } from '@solana/wallet-adapter-base'
import { Commitment, Connection, PublicKey, Transaction, TransactionSignature } from '@solana/web3.js'
import idl from '../bsl_swap.json'
import { BslSwap } from '../types/bsl_swap'

export const programId = new PublicKey(idl.metadata.address)
let program: Program<BslSwap>

export const getAnchorProgram = (connection: Connection, wallet: Wallet) => {
    if (program) return program
    const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'processed' })
    program = new Program(idl as any, programId, provider)
    return program
}

export const customGetOrCreateAssociatedTokenAccount = async (
    connection: Connection,
    payerPublicKey: PublicKey,
    mint: PublicKey,
    owner: PublicKey,
    sendTransaction: (transaction: Transaction, connection: Connection, options?: SendTransactionOptions) => Promise<TransactionSignature>,
    allowOwnerOffCurve = false,
    commitment?: Commitment,
    programId = TOKEN_PROGRAM_ID,
    associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
) => {
    try {
        const associatedToken = await getAssociatedTokenAddress(
            mint,
            owner,
            allowOwnerOffCurve,
            programId,
            associatedTokenProgramId
        )

        // This is the optimal logic, considering TX fee, client-side computation, RPC roundtrips and guaranteed idempotent.
        // Sadly we can't do this atomically.
        let account: Account
        try {
            account = await getAccount(connection, associatedToken, commitment, programId)
        } catch (error: unknown) {
            // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
            // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
            // TokenInvalidAccountOwnerError in this code path.
            if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
                // As this isn't atomic, it's possible others can create associated accounts meanwhile.
                try {
                    const transaction = new Transaction().add(
                        createAssociatedTokenAccountInstruction(
                            payerPublicKey,
                            associatedToken,
                            owner,
                            mint,
                            programId,
                            associatedTokenProgramId
                        )
                    )
    
                    await sendTransaction(transaction, connection)
                } catch (error: unknown) {
                    // Ignore all errors for now there is no API-compatible way to selectively ignore the expected
                    // instruction error if the associated account exists already.
                }
    
                // Now this should always succeed
                account = await getAccount(connection, associatedToken, commitment, programId)
            } else {
                console.error(error)
                return
            }
        }
    
        if (!account.mint.equals(mint)) throw new TokenInvalidMintError()
        if (!account.owner.equals(owner)) throw new TokenInvalidOwnerError()
    
        return account
    } catch (error) {
        console.error('Error getting or creating associated token address: ', error)
    }
}