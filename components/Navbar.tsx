'use client';
import { Heading } from '@radix-ui/themes';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import React, { useState } from 'react';
import { SunIcon } from '@radix-ui/react-icons';
import { IoMoon, IoClose } from 'react-icons/io5';
import { FaBars } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
// import { useReadContract } from '@/utils/hooks/useReadContract';

const Navbar = () => {
    const currentPath = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const { address, isConnected } = useAccount();

    // Web3 to read the contract

    // const [isAdmin, setIsAdmin] = useState(false);

    // const { data, error } = useReadContract('isAdmin', address);

    // useEffect(() => {
    //     if (error) console.error(error);
    //     if (data === true || data === false) setIsAdmin(data);
    // }, [data, error]);

    const links = [
        { href: '/', label: 'Home' },
        { href: '/college/request', label: 'Request' }, 
        { href: '/certificate/generate', label: 'Generate' },
        { href: '/certificate/validate', label: 'Validate' },
        isConnected && address
            ? { href: '/college', label: `${address.slice(0, 7)}...${address.slice(-5)}` }
            : { href: '/connect', label: 'Connect' },
    ];

    return (
        <div>
            <header className="flex justify-between items-center px-6 py-4 border-b-2 w-full">
                <Heading as="h1" className="text-purple-500">
                    Certify
                </Heading>
                <div className="lg:hidden flex space-x-4">
                    {/* Hamburger Button */}
                    {theme === 'light' ? (
                        <button className="focus:outline-none" onClick={() => setTheme('dark')}>
                            <IoMoon />
                        </button>
                    ) : (
                        <button className="focus:outline-none" onClick={() => setTheme('light')}>
                            <SunIcon />
                        </button>
                    )}
                    <button
                        className="flex items-center justify-center p-2 rounded-md focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <IoClose /> : <FaBars />}
                    </button>
                </div>

                {/* Navigation Links for Large Screens */}
                <nav className="hidden lg:flex">
                    <ul className="flex space-x-4">
                        {links.map((item) => (
                            <li
                                key={`${item.href}${item.label}`}
                                className={`${currentPath == item.href ? 'border-b-2' : ''}`}
                            >
                                <Link href={item.href}>{item.label}</Link>
                            </li>
                        ))}
                        {theme === 'light' ? (
                            <button className="focus:outline-none" onClick={() => setTheme('dark')}>
                                <IoMoon />
                            </button>
                        ) : (
                            <button className="focus:outline-none" onClick={() => setTheme('light')}>
                                <SunIcon />
                            </button>
                        )}
                    </ul>
                </nav>
            </header>

            {/* Dropdown Menu for Mobile */}
            {isMenuOpen && (
                <div className="lg:hidden">
                    <ul className="flex flex-col items-center py-4">
                        {links.map((item) => (
                            <li
                                key={`${item.href}${item.label}`}
                                className={`${
                                    currentPath == item.href ? 'font-bold' : ''
                                } py-2 border-b-2 w-full text-center border-gray-300`}
                            >
                                <Link href={item.href} onClick={() => setIsMenuOpen(false)}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navbar;
