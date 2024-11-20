'use client';
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { useParams,useRouter } from "next/navigation";
import { Flex, Text, Button, Grid,Card,Badge,Heading } from "@radix-ui/themes";
import { SessionProvider, useSession } from "next-auth/react";
import NavBar from "@/app/components/navbar";
import { Label } from "@radix-ui/react-dropdown-menu";

export default function AulaPage() {
  return (
    <>
    <Aula />
    </>
  );
}
function Aula(){
    interface EstudianteData {
        id: number;
        nombre: string;
        snombre: string;
        apellido1: string;
        apellido2: string;
    }
    const params = useParams(); // Obtiene los parámetros de la URL
    const aula = params.id_aula;   // Accede al parámetro `mode`
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return; // Espera hasta que se cargue la sesión
  
      if (!session) {
        router.push('/auth/login'); // Redirige a "/auth/login" si no hay sesión
      } else {
        if(!(session.user?.email?.trim() === "admin")){
          router.push('/denegado')
        }
        router.push(`/admin/listaAlumnos/${aula}`); // Redirige a "/aulas" si la sesión existe
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
      <div className="grid grid-rows-[20px_1fr_20px] items-start justify-items-center min-h-screen p-2 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Heading>Lista de Alumnos</Heading>
      <main className="flex gap-8 row-start-2 items-start sm:items-start">
      <form>
        <div className="flex flex-col gap-4 p-4">
                  {data? (
                  data.map((item, index) => (
                    <Flex direction={"column"} key={index}>
                        <Label> {item.nombre} {item.snombre?item.snombre:''} {item.apellido1} {item.apellido2} </Label>
                    </Flex>
                  ))
                ) : (
                  <p>Cargando datos...</p>
                )}
            {/* <Button color="primary" href="/studentboard/tests" as={Link}  className="font-semibold">inciar</Button>  */}
        </div>
        </form>
      </main>
      </div>
    );
  }