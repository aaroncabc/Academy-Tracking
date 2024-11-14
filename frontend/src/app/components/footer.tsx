'use client';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@radix-ui/themes';

const Footer = () => {
    return (
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
            
            <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="/"
            >
                <Image
                    aria-hidden
                    src="/globe.svg"
                    alt="Globe icon"
                    width={16}
                    height={16}
                />
                FLAKE
            </a>
        </footer>
    );
};

export default Footer;