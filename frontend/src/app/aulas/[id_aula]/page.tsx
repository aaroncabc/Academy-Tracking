'use client';
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import { useRouter } from 'next/router';
import { Flex, Text, Button, Grid,Card,Badge,Heading } from "@radix-ui/themes";
import { SessionProvider, useSession } from "next-auth/react";

export default function AulasPage() {
  return (
    <SessionProvider>
    <Aulas />
    </SessionProvider>
  );
}
function Aulas(){
    interface EstudianteData {
        id: number;
        nombre: string;
        snombre: string;
        apellido1: string;
        apellido2: string;
    }
    const params = useParams(); // Obtiene los parámetros de la URL
    const aula = params.id_aula;   // Accede al parámetro `mode`
    const {data:session} = useSession();

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
    <div>
      <p><strong>Nombre de usuario:</strong> {session?.user?.name}</p>
      <p><strong>Rol:</strong> {session?.user?.email}</p> {/* Muestra el valor de `rol` */}        
    </div>
    <Grid columns="1" gap="3" rows="repeat(2, 100px)" width="auto">
    {data? (
          data.map((item, index) => (
            <Card key={index} >
                <Heading> {item.nombre} {item.snombre?item.snombre:''} {item.apellido1} {item.apellido2} </Heading>
                <Flex direction={"column"} pt={"20px"}>
                <Text wrap={"pretty"}><strong>Asistencia:</strong></Text>
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