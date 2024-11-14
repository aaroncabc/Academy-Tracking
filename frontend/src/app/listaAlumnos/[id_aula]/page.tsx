'use client';
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { useParams,useRouter } from "next/navigation";
import { Flex, Text, Button, Grid,Card,Badge,Heading } from "@radix-ui/themes";
import { SessionProvider, useSession } from "next-auth/react";
import NavBar from "@/app/components/navbar";

export default function AulaPage() {
  return (
    <SessionProvider>
    <NavBar></NavBar>
    <Aula />
    </SessionProvider>
  );
}
function Aula(){
    const router = useRouter();
    interface EstudianteData {
        id: number;
        nombre: string;
        snombre: string;
        apellido1: string;
        apellido2: string;
    }
    const params = useParams(); // Obtiene los parámetros de la URL
    const aula = params.id_aula;   // Accede al parámetro `mode`
    const { data: session,status} = useSession();
    useEffect(() => {
      if (status === 'loading') return; // Espera hasta que se cargue la sesión
  
      if (!session) {
        router.push('/auth/login'); // Redirige a "/auth/login" si no hay sesión
      } else {
        router.push(`/listaAlumnos/${aula}`); // Redirige a "/aulas" si la sesión existe
      }
    }, [session, status, router]);

    const url = aula ? `http://localhost:5000/api/listaAlumnos?aula=${aula}` : '';
    const [data, setData] = useState<EstudianteData[]>([]);
    useEffect(() => {
        fetch(url)  // URL de la API Flask
            .then(response => response.json())
            .then(data => setData(data));
    }, []);
    
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
    <Card>
    <Heading>Lista de Alumnos</Heading>
    <Flex direction={"column"} gap={"4"} p={"3"}>
    {data? (
          data.map((item, index) => (
            <Flex direction={"column"} key={index}>
                <Heading> {item.nombre} {item.snombre?item.snombre:''} {item.apellido1} {item.apellido2} </Heading>
                <Flex direction={"column"} pt={"20px"}>
                <Text wrap={"pretty"}><strong>Asistencia:</strong></Text>
                </Flex>
            </Flex>
          ))
        ) : (
          <p>Cargando datos...</p>
        )}
    </Flex>
    </Card>
    </main>
    </div>
  );
}