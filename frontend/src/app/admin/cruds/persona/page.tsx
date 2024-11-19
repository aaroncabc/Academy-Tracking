'use client';
import Swal from "sweetalert2";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { Flex, Button, Card, TextField, Heading, Select } from "@radix-ui/themes";
import bcrypt from "bcrypt";
import { useSession } from "next-auth/react";

export default function CrearPersonaPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { data: session,status} = useSession();
    useEffect(() => {
      if (status === 'loading') return; // Espera hasta que se cargue la sesión
  
      if (!session) {
        router.push('/auth/login'); // Redirige a "/auth/login" si no hay sesión
      } else {
        if(!(session.user?.email?.trim() === "admin")){
          router.push('/denegado')
        }else{
        router.push('/admin/cruds/persona'); // Redirige a "/aulas" si la sesión existe
        }
      }
    }, [session, status, router]);

    async function crearPersona(formData: FormData) {
        try {
            const plainPassword = formData.get("Password")?.toString();
            if (!plainPassword) {
                throw new Error("La contraseña no puede estar vacía.");
            }
            const hashedPassword = plainPassword;

            const data = {
                Nombre: formData.get("Nombre")?.toString(),
                Segundo_nombre: formData.get("Segundo_nombre")?.toString() || null,
                Apellido1: formData.get("Apellido1")?.toString(),
                Apellido2: formData.get("Apellido2")?.toString(),
                Tipo_identificacion: formData.get("Tipo_identificacion")?.toString(),
                Numero_documento: formData.get("Numero_documento")?.toString(),
                Direccion: formData.get("Direccion")?.toString(),
                Celular: formData.get("Celular")?.toString(),
                Cargo: formData.get("Cargo")?.toString(),
                Usuario: formData.get("Usuario")?.toString(),
                Password: hashedPassword,
            };

            const loadingAlert = Swal.fire({
                title: 'Creando Persona...',
                text: 'Por favor, espere mientras se procesa su solicitud.',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const res = await fetch('http://localhost:5000/api/createPersona', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                setError(errorData.error || 'Error inesperado.');
                await Swal.fire({
                    title: 'Error',
                    text: errorData.error || 'No se pudo crear la persona.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            } else {
                await Swal.fire({
                    title: 'Éxito',
                    text: '¡Persona creada exitosamente!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                router.push("/admin/cruds/personas");
            }
        } catch (error) {
            setError('Se produjo un error inesperado.');
            console.error("Error:", error);
            await Swal.fire({
                title: 'Error',
                text: error instanceof Error ? error.message : 'Se produjo un error inesperado.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } finally {
            Swal.close();
        }
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-3xl">
                <Card variant="classic">
                    <form action={crearPersona}>
                        <div className="flex flex-col gap-6 p-6">
                            <Heading>Crear Tutor</Heading>

                            {/* Sección: Información Personal */}
                            <div className="flex flex-col gap-4">
                                <Heading size="3">Información Personal</Heading>
                                <div className="flex flex-wrap gap-4">
                                    <TextField.Root type="text" name="Nombre" placeholder="Primer Nombre" size="3" required />
                                    <TextField.Root type="text" name="Segundo_nombre" placeholder="Segundo Nombre" size="3" />
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <TextField.Root type="text" name="Apellido1" placeholder="Primer Apellido" size="3" required />
                                    <TextField.Root type="text" name="Apellido2" placeholder="Segundo Apellido" size="3" required />
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <Select.Root name="Tipo_identificacion" required>
                                        <Select.Trigger placeholder="Tipo de Identificación" />
                                        <Select.Content>
                                            <Select.Item value="CC">Cédula de ciudadanía (CC)</Select.Item>
                                            <Select.Item value="PSP">Pasaporte (PSP)</Select.Item>
                                            <Select.Item value="TE">Tarjeta de extranjería (TE)</Select.Item>
                                            <Select.Item value="NIT">Número de identificación tributaria (NIT)</Select.Item>
                                            <Select.Item value="PEP">Permiso especial de permanencia (PEP)</Select.Item>
                                            <Select.Item value="DIE">Documento de identificación extranjero (DIE)</Select.Item>
                                        </Select.Content>
                                    </Select.Root>
                                    <TextField.Root type="text" name="Numero_documento" placeholder="Número de Documento" size="3" required />
                                </div>
                            </div>

                            {/* Sección: Contacto */}
                            <div className="flex flex-col gap-4">
                                <Heading size="3">Contacto</Heading>
                                <div className="flex flex-wrap gap-4">
                                    <TextField.Root type="text" name="Direccion" placeholder="Dirección" size="3" required />
                                    <TextField.Root type="text" name="Celular" placeholder="Celular" size="3" required />
                                </div>
                            </div>

                            {/* Sección: Información Laboral */}
                            <div className="flex flex-col gap-4">
                                <Heading size="3">Información Laboral</Heading>
                                <div className="flex flex-wrap gap-4">
                                    <TextField.Root type="text" name="Cargo" placeholder="Cargo" size="3" required />
                                    <TextField.Root type="text" name="Usuario" placeholder="Usuario" size="3" required />
                                </div>
                                <TextField.Root type="password" name="Password" placeholder="Contraseña" size="3" required />
                            </div>

                            {/* Error y Botón */}
                            {error && <p className="text-red-500">{error}</p>}
                            <Button variant="soft" type="submit" className="font-semibold">
                                Crear Persona
                            </Button>
                        </div>
                    </form>
                </Card>
            </main>
        </div>
    );
}
