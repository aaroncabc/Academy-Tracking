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


const fetchEsTutor = async (tutor:any, aula:any) => {
  try {
    const response = await fetch(`http://localhost:5000/api/estutor?tutor=${tutor}&aula=${aula}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Devuelve los datos si es necesario
  } catch (error) {
    console.error('Error al realizar la petición:', error);
  }
};

function Aula(){
    interface EstudianteData {
        id_std: string;
        nombre: string;
        snombre: string;
        apellido1: string;
        apellido2: string;
    } 
    
    const [currentDate, setCurrentDate] = useState("");
    interface Attendance {
      nombre: string;
      asistencia: string;
    }
    
    const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);

    useEffect(() => {
      // Obtiene la fecha actual del sistema
      const today = new Date();
      const formattedDate = today.toLocaleDateString(); // Puedes personalizar el formato si es necesario
      setCurrentDate(formattedDate);
    }, []);


    const params = useParams(); // Obtiene los parámetros de la URL
    const aula = params.id_aula;   // Accede al parámetro `mode`
    const { data: session, status } = useSession();
    const router = useRouter();
    const tutor = session?.user?.name?.split(' ')[0]

    useEffect(() => {
      const checkSession = async () => {
        if (status === 'loading') return; // Espera hasta que se cargue la sesión
    
        if (!session || await fetchEsTutor(tutor,aula)) {
          router.push('/auth/login'); // Redirige a "/auth/login" si no hay sesión
        } else {
            router.push(`/tutor/listaAlumnos/${aula}`);  
            router.push('/denegado')
        }
      };
      checkSession();
    }, [session, status, router]);

    const url = aula ? `http://localhost:5000/api/listaAlumnos?aula=${aula}` : '';
    const [data, setData] = useState<EstudianteData[]>([]);
    useEffect(() => {
        fetch(url)  // URL de la API Flask
            .then(response => response.json())
            .then(data => setData(data));
    }, []);
      // Actualizar el estado de asistencia
    const handleAttendanceChange = (studentName:any, attendance:any) => {
      setAttendanceData((prevData) => {
        const updatedData = prevData.filter(item => item.nombre !== studentName);
        return [...updatedData, { nombre: studentName, asistencia: attendance }];
      });
   };

    // envio de formulario
    const [error, setError] = useState<string | null>(null);    
    async function asistencia(formData: FormData) {
        // Mostrar alerta de carga
        const loadingAlert = Swal.fire({
            title: 'Cargando...',
            text: 'Por favor, espere mientras se procesa su solicitud.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading(); // Muestra el spinner de carga
            },
        });

        try {
            const res = await  fetch("http://localhost:5000/api/tomarAsistencia", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ aula, asistencias: attendanceData, fecha: currentDate }), // Incluye aula y los datos de asistencia
            });
            if (!res.ok) {
                await Swal.fire({
                    title: 'Error',
                    text: 'Error inesperado en la toma de asistencia',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            } else {
                await Swal.fire({
                    title: 'Éxito',
                    text: 'Asistencia tomada con éxito',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                router.push(`/tutor/aulas`);
            }
        } catch (error) {
            setError('Se produjo un error inesperado.');
            await Swal.fire({
                title: 'Error',
                text: 'Se produjo un error inesperado.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } finally {
            Swal.close(); // Cierra la alerta de carga
        }

    }

    
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <main className="flex flex-col gap-8 row-start-2 items-start sm:items-start">
    <Heading>Lista de Alumnos - {currentDate}</Heading>
    <form action={asistencia} >
      <div className="flex flex-col gap-4 p-4">
                {data? (
                data.map((item, index) => (
                  <Flex direction={"column"} key={index}>
                      <Label> {item.nombre} {item.snombre?item.snombre:''} {item.apellido1} {item.apellido2} </Label>
                      <RadioGroup.Root onValueChange={(value) => handleAttendanceChange(item.id_std, value)}>
                          <RadioGroup.Item value="true">Asistió</RadioGroup.Item>
                          <RadioGroup.Item value="tarde">Tarde</RadioGroup.Item>
                          <RadioGroup.Item value="false">Faltó</RadioGroup.Item>                       
                      </RadioGroup.Root>
                  </Flex>
                ))
              ) : (
                <p>Cargando datos...</p>
              )}
              {error && <p className="text-red-500">{error}</p>}
          {/* <Button color="primary" href="/studentboard/tests" as={Link}  className="font-semibold">inciar</Button>  */}
          <Button variant="soft" type="submit"  className="font-semibold">iniciar</Button> 
      </div>
      </form>
    </main>
    </div>
  );
}