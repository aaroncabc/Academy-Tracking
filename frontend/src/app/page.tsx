'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionProvider, useSession } from 'next-auth/react';

export default function HomePage() {
  return (
    <SessionProvider>
      <Home />
    </SessionProvider>
  );
}

function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Espera hasta que se cargue la sesión

    if (!session) {
      router.push('/auth/login'); // Redirige a "/auth/login" si no hay sesión
    } else {
      if(session.user?.email?.trim() === "admin"){
        router.push('/admin/aulas');
      }else{
        router.push('/tutor/aulas'); // Redirige a "/tutores" si la sesión existe
      }
    }
  }, [session, status, router]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* Contenido de la página */}
      </main>
    </div>
  );
}

