import { Wallet } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, PublicKey, Transaction, SystemProgram, SYSVAR_RENT_PUBKEY, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { getAnchorProgram } from './utils'

const paymentWallet = new PublicKey('oEkvFgLAU1Zhr9WCtiFADzeEkyU6YhkASsKpUDLTfAD')

type ProviderParams = {
    connection: Connection
    wallet: Wallet
}

type CommonParams = {
    swapState: PublicKey
    escrow: PublicKey
    mintAssetA: PublicKey
    offeror: PublicKey
    offeree: PublicKey
}

type InitializeUserStateInstructionParams = ProviderParams & {
    bump: number
    userState: PublicKey
    user: PublicKey
    userSeed: PublicKey
}

export const initializeUserStateInstruction = ({
    connection, wallet, bump, userState, user, userSeed
}: InitializeUserStateInstructionParams) => {
    const program = getAnchorProgram(connection, wallet)
    return program.methods.initializeUserState(bump)
        .accounts({ userState, user, userSeed })
        .instruction()
}

type InitializeSwapStateInstructionParams = ProviderParams & {
    swapBump: number
    swapState: PublicKey
    offeror: PublicKey
    offeree: PublicKey
}

export const initializeSwapStateInstruction = ({
    connection, wallet, swapBump, swapState, offeror, offeree
}: InitializeSwapStateInstructionParams) => {
    const program = getAnchorProgram(connection, wallet)
    return program.methods.initializeSwapState(swapBump)
        .accounts({ swapState, offeror, offeree, systemProgram: SystemProgram.programId, tokenProgram: TOKEN_PROGRAM_ID, rent: SYSVAR_RENT_PUBKEY })
        .transaction()
}

type InitializeEscrowInstructionParams = ProviderParams & CommonParams & {
    escrowBump: number
}

export const initializeEscrowInstruction = ({
    connection, wallet, escrowBump, swapState, escrow, mintAssetA, offeror, offeree
}: InitializeEscrowInstructionParams) => {
    const program = getAnchorProgram(connection, wallet)
    return program.methods.initializeEscrow(escrowBump)
        .accounts({ swapState, escrow, mintAssetA, offeror, offeree, systemProgram: SystemProgram.programId, tokenProgram: TOKEN_PROGRAM_ID, rent: SYSVAR_RENT_PUBKEY })
        .transaction()
}

type InitiateSwapTransactionParams = ProviderParams & CommonParams & {
    mintAssetB: PublicKey
    ataOfferorAssetA: PublicKey
    offerorState: PublicKey
    offereeState: PublicKey
}

export const initiateSwapTransaction = async ({
    connection, wallet, swapState, escrow, mintAssetA, offeror, offeree, mintAssetB, ataOfferorAssetA, offerorState, offereeState
}: InitiateSwapTransactionParams) => {
    const program = getAnchorProgram(connection, wallet)
    const transaction = await program.methods.initiateSwap()
        .accounts({ swapState, escrow, mintAssetA, offeror, offeree, mintAssetB, ataOfferorAssetA, offerorState, offereeState, tokenProgram: TOKEN_PROGRAM_ID })
        .transaction()
    transaction.add(
        SystemProgram.transfer({
            fromPubkey: offeror,
            toPubkey: paymentWallet,
            lamports: 0.01 * LAMPORTS_PER_SOL
        })
    )
    return transaction
}

type CancelSwapTransactionParams = InitiateSwapTransactionParams

export const cancelSwapTransaction = ({
    connection, wallet, swapState, escrow, mintAssetA, offeror, offeree, mintAssetB, ataOfferorAssetA, offerorState, offereeState
}: CancelSwapTransactionParams) => {
    const program = getAnchorProgram(connection, wallet)
    return program.methods.cancelSwap()
        .accounts({ swapState, escrow, mintAssetA, offeror, offeree, mintAssetB, ataOfferorAssetA, offerorState, offereeState, tokenProgram: TOKEN_PROGRAM_ID })
        .transaction()
}

type AcceptSwapOneInstructionParams = ProviderParams & CommonParams & {
    mintAssetB: PublicKey
    ataOffereeAssetA: PublicKey
    offerorState: PublicKey
    offereeState: PublicKey
}

const acceptSwapOneTransaction = ({
    connection, wallet, swapState, escrow, mintAssetA, offeror, offeree, mintAssetB, ataOffereeAssetA, offerorState, offereeState
}: AcceptSwapOneInstructionParams) => {
    const program = getAnchorProgram(connection, wallet)
    return program.methods.acceptSwapOne()
        .accounts({ swapState, escrow, mintAssetA, offeror, offeree, mintAssetB, ataOffereeAssetA, offerorState, offereeState, tokenProgram: TOKEN_PROGRAM_ID })
        .instruction()
}

type AcceptSwapTwoInstructionParams = ProviderParams & CommonParams & {
    mintAssetB: PublicKey
    ataOfferorAssetB: PublicKey
    ataOffereeAssetB: PublicKey
}

const acceptSwapTwoTransaction = ({
    connection, wallet, swapState, escrow, mintAssetA, offeror, offeree, mintAssetB, ataOfferorAssetB, ataOffereeAssetB
}: AcceptSwapTwoInstructionParams) => {
    const program = getAnchorProgram(connection, wallet)
    return program.methods.acceptSwapTwo()
        .accounts({ swapState, mintAssetA, offeror, offeree, mintAssetB, ataOfferorAssetB, ataOffereeAssetB, tokenProgram: TOKEN_PROGRAM_ID })
        .instruction()
}

type AcceptSwapTransactionParams = AcceptSwapOneInstructionParams & AcceptSwapTwoInstructionParams

export const acceptSwapTransaction = async (params: AcceptSwapTransactionParams) => {
    const transaction = new Transaction()
    transaction.add(await acceptSwapOneTransaction(params))
    transaction.add(await acceptSwapTwoTransaction(params))
    return transaction
}