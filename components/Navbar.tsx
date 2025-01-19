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
import { readContract } from '@wagmi/core';
import { config } from '@/utils/config';
import contractABI from '@/utils/abi/certify.json';
import { sepolia } from 'viem/chains';
// import { useReadContract } from '@/utils/hooks/useReadContract';

const Navbar = () => {
    const currentPath = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const { address, isConnected } = useAccount();

    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    // Web3 to read the contract
    const CONTRACT_ADDRESS = '0x96EC6272b3bD0c5934b150dc8ca9ea4FF0009BeA';

    const fetchIsAdmin = async () => {
        if (!address) return;

        try {
            const isadmin = await readContract(config, {
                abi: contractABI,
                address: CONTRACT_ADDRESS as `0x${string}`,
                functionName: 'isAdmin',
                chainId: sepolia.id,
                account: address,
            });

            setIsAdmin(isadmin as boolean);
        } catch (err: any) {
            console.error('Error fetching data:', err);
        }
    }

    if (address) fetchIsAdmin();

    const links = [
        { href: '/', label: 'Home' },
        ...(isConnected ? (
            isAdmin ? [
                { href: '/certificate/validate', label: 'Validate' },
                { href: '/profile', label: address ? `${address.slice(0, 7)}...${address.slice(-5)}` : 'Profile' }
            ] : [
                { href: '/college/request', label: 'Request' },
                { href: '/certificate/generate', label: 'Generate' },
                { href: '/certificate/validate', label: 'Validate' },
                { href: '/profile', label: address ? `${address.slice(0, 7)}...${address.slice(-5)}` : 'Profile' }
            ]
        ) : [
            { href: '/connect', label: 'Connect' }
        ])
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
                                className={`${currentPath == item.href ? 'font-bold' : ''
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
