'use client';
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { useParams,useRouter } from "next/navigation";
import { Flex, Text, Button, Grid,Card,Badge,Heading, TextField, RadioGroup } from "@radix-ui/themes";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import NavBar from "@/app/components/navbar";
import { error } from "console";
import Swal from "sweetalert2";
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
        id_std: string;
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
      const checkSession = async () => {
        if (status === 'loading') return; // Espera hasta que se cargue la sesión
    
        if (!session) {
          router.push('/auth/login'); // Redirige a "/auth/login" si no hay sesión
        } else {
            router.push(`/tutor/listaAlumnos/${aula}`);  
        }
      };
      checkSession();
    }, [session, status, router]);

    const url = aula ? `http://localhost:5000/api/listaAlumnos?aula=${aula}` : '';
    const url2 = aula ? `/tomarAsistencia/${aula}` : '';
    const url3 = aula ? `/VerTomarNotas/${aula}` : '';
    const [data, setData] = useState<EstudianteData[]>([]);
    useEffect(() => {
        fetch(url)  // URL de la API Flask
            .then(response => response.json())
            .then(data => setData(data));
    }, []);
    const [esTutor, setEsTutor] = useState<boolean>(false);
    useEffect(() => {
      if(session?.user?.email?.trim() !== "admin"){
      fetch('http://localhost:5000/api/esTutor?tutor='+session?.user?.name?.split(' ')[0]+'&aula='+aula)  // URL de la API Flask
        .then(response => response.json())
        .then(data => setEsTutor(data));}
    })
    useEffect(() => {
    if (esTutor === false && session?.user?.email?.trim() !== "admin"){
        router.push('/denegado')
    }
  
    }, [esTutor]);

    
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <main className="flex flex-col gap-8 row-start-2 items-start sm:items-start">
    <Heading>Lista de Alumnos
    </Heading>
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
      <Flex direction="row" gap="4"> 
      <Button><a href={url2}>Tomar lista</a></Button>
      <Button><a href={url3}>Consultar/Actualizar Notas</a></Button>
      </Flex>
      </form>
    </main>
    </div>
  );
}