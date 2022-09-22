import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Wallet } from '../components/Wallet'

function MyApp({ Component, pageProps }: AppProps) {
  return <Wallet>
    <Component {...pageProps} />
  </Wallet>
}

export default MyApp
