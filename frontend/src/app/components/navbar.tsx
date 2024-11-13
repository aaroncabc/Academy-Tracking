'use client';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@radix-ui/themes';

const NavBar = () => {
    const { data: session } = useSession();
    const rol = session?.user?.email
    const usuario = session?.user?.name?.split(' ')[1];  
    return (
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-end p-10">
            <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="/aulas"  
            >
                <Image
                    aria-hidden
                    src="/file.svg"
                    alt="File icon"
                    width={16}
                    height={16}
                />
                Aulas
            </a>
            <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Image
                    aria-hidden
                    src="/window.svg"
                    alt="Window icon"
                    width={16}
                    height={16}
                />
                Notas
            </a>
            <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
            >
                {usuario} ({rol})
            </a>
            <Button variant='ghost' onClick={() => signOut()}>Sign out</Button>
        </footer>
    );
};

export default NavBar;