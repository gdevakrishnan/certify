'use client'
import { Heading } from '@radix-ui/themes'
import { useTheme } from 'next-themes';
import Link from 'next/link'
import React, { useState } from 'react'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    const links = [
        { href: '/', label: 'Home' },
        { href: '/certificate/generate', label: 'Generate' },
        { href: '/certificate/validate', label: 'Validate' },
        { href: '/college/request', label: 'Request' },
        { href: '/college', label: 'College' },
    ];

    return (
        <div>
            <header className="flex justify-between items-center px-6 py-4 border-b-2">
                <Heading as="h1">Certify</Heading>
                {/* Hamburger Button */}
                <button
                    className="lg:hidden flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                        />
                    </svg>
                </button>

                {/* Navigation Links for Large Screens */}
                <nav className="hidden lg:flex">
                    <ul className="flex space-x-4">
                        {links.map((item) => (
                            <li key={`${item.href}${item.label}`}>
                                <Link href={item.href}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        {
                            theme === 'light' ? (
                                <button
                                    className="focus:outline-none"
                                    onClick={() => setTheme('dark')}
                                >
                                    Dark
                                </button>
                            ) : (
                                <button
                                    className="focus:outline-none"
                                    onClick={() => setTheme('light')}
                                >
                                    Light
                                </button>
                            )
                        }
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
                                className="py-2 border-b-2 w-full text-center border-gray-300"
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
