'use client';
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import { useRouter } from 'next/router';
import { Flex, Text, Button, Grid,Card,Badge,Heading } from "@radix-ui/themes";
import { SessionProvider, useSession } from "next-auth/react";
import NavBar from "@/app/components/navbar";

export default function ByTutorPage() {
  return (
    <SessionProvider>
      <NavBar></NavBar>
      <ByTutor />
    </SessionProvider>
  );
}

function ByTutor(){
  const router = useRouter();
    interface AulaData {
        grupo: string;
        gradot: string;
        grado: number;
        institucion: string;
        id_aula:number;
        hora_i:string;
        hora_f:string;
    }
    const { data: session,status} = useSession();
    useEffect(() => {
      if (status === 'loading') return; // Espera hasta que se cargue la sesión
  
      if (!session) {
        router.push('/auth/login'); // Redirige a "/auth/login" si no hay sesión
      } else {
        router.push('/aulas/porTomar'); // Redirige a "/aulas" si la sesión existe
      }
    }, [session, status, router]);
    const id = session?.user?.name?.split(' ')[0];
    const usuario = session?.user?.name?.split(' ')[1];  
    const url = `http://localhost:5000/api/porTomar?tutor=${id}`;
    const [data, setData] = useState<AulaData[]>([]);
    useEffect(() => {
        fetch(url)  // URL de la API Flask
            .then(response => response.json())
            .then(data => setData(data));
    }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
    <Grid columns="1" gap="3" rows="repeat(2, 160px)" width="auto" align={"center"}>
    {data? (
          data.map((item, index) => (
            <Card key={index} >
                <Heading><strong>Grupo:</strong> {item.grupo}</Heading>
                <Badge ><strong>Grado:</strong> {item.gradot} ({item.grado}°)</Badge>
                <Flex direction={"column"} pt={"20px"}>
                <Text wrap={"pretty"}><strong>Institución:</strong> {item.institucion}</Text>
                <Text>{item.hora_i} to {item.hora_f}</Text>
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