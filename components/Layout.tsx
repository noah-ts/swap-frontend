import Link from 'next/link'
import { FC, ReactNode, useState } from 'react'
import {
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui'

const MenuIcon: FC<{ open: () => void }> = ({ open }) => (
    <svg
        onClick={open}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-10 h-10 cursor-pointer"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
)

const CloseIcon: FC<{ close: () => void }> = ({ close }) => (
    <svg
        onClick={close}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-10 h-10 cursor-pointer"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const SwapIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8 cursor-pointer"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
)

const Menu: FC<{ isOpen: boolean, close: () => void }> = ({ isOpen, close }) => (
    <nav className={`${isOpen ? 'fixed' : 'hidden'} lg:inline-block w-80 border-r bg-green-100 shadow z-20 h-full lg:h-auto`}>
        <div className='lg:hidden flex justify-end pt-6 pr-4'>
            <CloseIcon close={close} />
        </div>
        <div className='text-center text-5xl pt-6 font-extralight'></div>
        <ul className='pl-10 pt-20 flex flex-col gap-10'>
            <li className='text-2xl'>
                <Link href='/swap'>
                    <div className='flex items-center'>
                        <SwapIcon />
                        <span className='pl-2 hover:underline cursor-pointer'>Swap</span>
                    </div>
                </Link>
            </li>
        </ul>
        <div className='pt-96 flex flex-col gap-6 px-6'>
            <WalletMultiButton />
            <WalletDisconnectButton />
        </div>
    </nav>
)

export const Layout: FC<{children: ReactNode}> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const open = () => setIsMenuOpen(true)
    const close = () => setIsMenuOpen(false)

    return <div className='flex flex-col md:flex-row h-full bg-green-50 text-green-900 font-light'>
        <Menu isOpen={isMenuOpen} close={close} />
        <header className='h-20 lg:hidden'>
            <div className='p-4 pt-6'>
                <MenuIcon open={open} />
            </div>
        </header>
        <main className='min-h-screen max-h-full w-full lg:inline-block px-6 py-2 md:p-10'>{children}</main>
    </div>
}