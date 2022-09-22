import React, { FC, ReactNode, useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { LedgerWalletAdapter } from '@solana/wallet-adapter-ledger';
import {
    WalletModalProvider
} from '@solana/wallet-adapter-react-ui'

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css')

export const Wallet: FC<{ children: ReactNode }> = ({ children }) => {
    const endpoint = 'https://lively-frequent-meadow.solana-mainnet.discover.quiknode.pro/1f1ef10280be82c5138b8e7b05808cb2707009f2/'

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new LedgerWalletAdapter()
        ],
        []
    )

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}