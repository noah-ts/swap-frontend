import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React, { useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { SolletWalletAdapter } from '@solana/wallet-adapter-sollet'
import {
    WalletModalProvider
} from '@solana/wallet-adapter-react-ui'

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css')

function MyApp({ Component, pageProps }: AppProps) {
    const endpoint = 'https://lively-frequent-meadow.solana-mainnet.discover.quiknode.pro/1f1ef10280be82c5138b8e7b05808cb2707009f2/'

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new SolletWalletAdapter()
        ],
        []
    )

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  <Component {...pageProps} />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default MyApp
