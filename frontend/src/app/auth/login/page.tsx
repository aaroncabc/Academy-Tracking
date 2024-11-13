'use client';
import Image from "next/image";
import Swal from "sweetalert2";
import {signIn} from "next-auth/react";
import React, { useEffect, useState } from 'react';
import { useParams,useRouter} from "next/navigation";
import { Flex, Text, Button, Grid, Card, Badge, Heading, Link, TextField} from "@radix-ui/themes";
// // import prisma from "@/lib/prisma";
export default function Login(){
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    
    async function login(formData: FormData) {
        const user = formData.get("user")?.toString();
        const password = formData.get("password")?.toString();

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
            const res = await signIn("credentials", {
                user: user,
                password: password,
                redirect: false,
            });

            if (res?.error) {
                setError(res.error);
                await Swal.fire({
                    title: 'Error',
                    text: res.error,
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            } else {
                await Swal.fire({
                    title: 'Éxito',
                    text: '¡Inicio de sesión exitoso!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                router.push("/asistencia");
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


    return(
        <div className="flex flex-row justify-center  ">
            <div className="box-border border-1 shadow-md  w-full md:w-1/5 mt-2 mb-2 bg-white"> 

                <form action={login} >
                <div className="flex flex-col gap-4 p-4">
                    <div className="">
                        <h1 className="font-semibold" >Iniciar Sesión</h1>
                    </div>
                        <div>
                        <TextField.Root type='text' name="user" placeholder="Ingrese su usuario" size={"3"} />
                        </div>
                        <div>
                            <TextField.Root type='password' name="password" placeholder="Ingrese su contraseña" size={"3"} />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                    {/* <Button color="primary" href="/studentboard/tests" as={Link}  className="font-semibold">inciar</Button>  */}
                   <Button type="submit"  className="font-semibold">iniciar</Button> 
                </div>
                </form>
            </div>
            </div>
    )
}