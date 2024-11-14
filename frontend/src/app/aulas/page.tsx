// app/asistencias/page.tsx
'use client';

import React, { use, useEffect, useState } from 'react';
import { Flex, Text, Grid, Card, Badge, Heading } from "@radix-ui/themes";
import { SessionProvider, useSession } from "next-auth/react";
import { truncate } from 'fs';
import NavBar from '../components/navbar';
import { useRouter } from 'next/navigation';

export default function AsistenciasPage() {
  return (
    <SessionProvider>
      <NavBar></NavBar>
      <Asistencias />
    </SessionProvider>
  );
}

function Asistencias() {
  const router = useRouter();
  interface AulaData {
    grupo: string;
    gradot: string;
    grado: number;
    institucion: string;
    id_aula:number;
  }

  const { data: session,status} = useSession();
  useEffect(() => {
    if (status === 'loading') return; // Espera hasta que se cargue la sesión

    if (!session) {
      router.push('/auth/login'); // Redirige a "/auth/login" si no hay sesión
    } else {
      router.push('/aulas'); // Redirige a "/aulas" si la sesión existe
    }
  }, [session, status, router]);
  const [data, setData] = useState<AulaData[]>([]);
  const id = session?.user?.name?.split(' ')[0];
  const usuario = session?.user?.name?.split(' ')[1];  
  useEffect(() => {
    fetch('http://localhost:5000/api/aulasTutor?tutor='+id)
      .then(response => response.json())
      .then(data => setData(data));
  })

  // En el return, asegúrate de que `rol` se muestra en el div:
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Grid columns="3" gap="3" rows="repeat(2, 160px)" width="auto">
          {data.length > 0 ? (
            data.map((item, index) => (
              <Card key={index}>
                <Heading><a href={`/listaAlumnos/${item.id_aula}`}><strong>Grupo:</strong> {item.grupo}</a></Heading>
                <Badge><strong>Grado:</strong> {item.gradot} ({item.grado}°)</Badge>
                <Flex direction={"column"} pt={"20px"}>
                  <Text wrap={"pretty"}><strong>Institución:</strong> {item.institucion}</Text>
                </Flex>
              </Card>
            ))
          ) : (
            <p>Cargando datos...</p>
          )}
        </Grid>
        
      </main>
    </div>
  );
}
