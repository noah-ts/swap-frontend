import { Wallet } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import { getAnchorProgram } from './utils'

type ProviderParams = {
    connection: Connection
    wallet: Wallet
}

type CommonParams = {
    swapState: PublicKey
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
        .instruction()
}

type InitializeEscrowStateInstructionParams = ProviderParams & {
    escrowState: PublicKey
    escrowStateBump: number
    mint: PublicKey
    offeror: PublicKey
}

export const initializeEscrowStateInstruction = ({
    connection, wallet, escrowState, escrowStateBump, mint, offeror
}: InitializeEscrowStateInstructionParams) => {
    const program = getAnchorProgram(connection, wallet)
    return program.methods.initializeEscrowState(escrowStateBump)
        .accounts({ escrowState, mint, offeror, systemProgram: SystemProgram.programId, rent: SYSVAR_RENT_PUBKEY })
        .instruction()
}

type InitializeEscrowInstructionParams = ProviderParams & CommonParams & {
    escrowState: PublicKey
    escrow: PublicKey
    escrowAtaBump: number
    mint: PublicKey
    ataOfferor: PublicKey
}

export const initializeEscrowInstruction = ({
    connection, wallet, escrowState, escrowAtaBump, swapState, escrow, mint, ataOfferor, offeror, offeree
}: InitializeEscrowInstructionParams) => {
    const program = getAnchorProgram(connection, wallet)
    return program.methods.initializeEscrow(escrowAtaBump)
        .accounts({ swapState, escrow, escrowState, mint, ataOfferor, offeror, offeree, systemProgram: SystemProgram.programId, tokenProgram: TOKEN_PROGRAM_ID, rent: SYSVAR_RENT_PUBKEY })
        .instruction()
}

type AddMintOffereeInstructionParams = ProviderParams & CommonParams & {
    mint: PublicKey
}

export const addMintOffereeInstruction = ({
    connection, wallet, swapState, mint, offeror, offeree
}: AddMintOffereeInstructionParams) => {
    const program = getAnchorProgram(connection, wallet)
    return program.methods.addMintOfferee()
        .accounts({ swapState, mint, offeror, offeree })
        .instruction()
}

type InitiateSwapInstructionParams = ProviderParams & CommonParams & {
    offerorState: PublicKey
    offereeState: PublicKey
}

export const initiateSwapInstruction = ({
    connection, wallet, swapState, offeror, offeree, offerorState, offereeState
}: InitiateSwapInstructionParams) => {
    const program = getAnchorProgram(connection, wallet)
    return program.methods.initiateSwap()
        .accounts({ swapState, offeror, offeree, offerorState, offereeState, tokenProgram: TOKEN_PROGRAM_ID })
        .instruction()
}

type CancelSwapInstructionParams = InitiateSwapInstructionParams

export const cancelSwapInstruction = ({
    connection, wallet, swapState, offeror, offeree, offerorState, offereeState
}: CancelSwapInstructionParams) => {
    const program = getAnchorProgram(connection, wallet)
    return program.methods.cancelSwap()
        .accounts({ swapState, offeror, offeree, offerorState, offereeState })
        .instruction()
}

type AcceptSwapInstructionParams = InitiateSwapInstructionParams

export const acceptSwapInstruction = ({
    connection, wallet, swapState, offeror, offeree, offerorState, offereeState
}: AcceptSwapInstructionParams) => {
    const program = getAnchorProgram(connection, wallet)
    return program.methods.acceptSwap()
        .accounts({ swapState, offeror, offeree, offerorState, offereeState })
        .instruction()
}

type CloseEscrowInstructionParams = ProviderParams & CommonParams & {
    escrowState: PublicKey
    escrow: PublicKey
    mint: PublicKey
    ata: PublicKey
}

export const closeEscrowInstruction = ({
    connection, wallet, swapState, offeror, offeree, escrowState, escrow, mint, ata
}: CloseEscrowInstructionParams) => {
    const program = getAnchorProgram(connection, wallet)
    return program.methods.closeEscrow()
        .accounts({ swapState, offeror, offeree, escrowState, escrow, mint, ata, tokenProgram: TOKEN_PROGRAM_ID })
        .instruction()
}

type TransferNftFromOffereeToOfferor = ProviderParams & CommonParams & {
    mint: PublicKey
    ataOfferor: PublicKey
    ataOfferee: PublicKey
}

export const transferNftFromOffereeToOfferorInstruction = ({
    connection, wallet, swapState, offeror, offeree, mint, ataOfferor, ataOfferee
}: TransferNftFromOffereeToOfferor) => {
    const program = getAnchorProgram(connection, wallet)
    return program.methods.transferNftFromOffereeToOfferor()
        .accounts({ swapState, offeror, offeree, mint, ataOfferor, ataOfferee, tokenProgram: TOKEN_PROGRAM_ID })
        .instruction()
}