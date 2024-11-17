'use client';
import Swal from "sweetalert2";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Flex, Button, Card, TextField, Select, Heading } from "@radix-ui/themes";
import { SessionProvider } from "next-auth/react";

export default function CrearAulaPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [grado, setGrado] = useState<string | null>(null); // Para autocompletar GradoT
    const [personas, setPersonas] = useState<any[]>([]); // Lista de personas desde la API
    const [instituciones, setInstituciones] = useState<any[]>([]); // Lista de instituciones desde la API
    
    useEffect(() => {
        // Obtener las personas y las instituciones de la API
        async function fetchData() {
            try {
                const [personasRes, institucionesRes] = await Promise.all([
                    fetch('http://localhost:5000/api/getPersonas'), // Endpoint para obtener personas
                    fetch('http://localhost:5000/api/getInstituciones') // Endpoint para obtener instituciones
                ]);

                if (personasRes.ok) {
                    const personasData = await personasRes.json();
                    setPersonas(personasData);
                }
                if (institucionesRes.ok) {
                    const institucionesData = await institucionesRes.json();
                    setInstituciones(institucionesData);
                }
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        }

        fetchData();
    }, []);
    async function crearAula(formData: FormData) {
        const data = {
            Grupo: formData.get("Grupo")?.toString(),
            GrupoT: formData.get("GrupoT")?.toString(),
            Jornada: formData.get("Jornada")?.toString(),
            Grado: formData.get("Grado")?.toString(),
            GradoT: formData.get("GradoT")?.toString(),
            Id_persona: formData.get("Id_persona")?.toString(),
            Id_institucion: formData.get("Id_institucion")?.toString(),
            Año: formData.get("Año")?.toString(),
        };

        const loadingAlert = Swal.fire({
            title: 'Creando Aula...',
            text: 'Por favor, espere mientras se procesa su solicitud.',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            const res = await fetch('http://localhost:5000/api/createAula', {
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
                    text: errorData.error || 'No se pudo crear el aula.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            } else {
                await Swal.fire({
                    title: 'Éxito',
                    text: '¡Aula creada exitosamente!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                router.push("/admin/cruds/aulas"); // Redirigir después de crear
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
            Swal.close();
        }
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <Card variant="classic">
                    <form action={crearAula}>
                        <div className="flex flex-col gap-4 p-4">
                            <Heading>Crear Aula</Heading>
                            <TextField.Root type='text' name="Grupo" placeholder="Grupo (Ej: 507)" size="3" required />
                            <TextField.Root type='text' name="GrupoT" placeholder="GrupoT (Ej: Quinto 07)" size="3" />

                            {/* Dropdown para Jornada */}
                            <Select.Root name="Jornada" required>
                                <Select.Trigger placeholder="Seleccionar Jornada" />
                                <Select.Content>
                                    <Select.Item value="Mañana">Mañana</Select.Item>
                                    <Select.Item value="Tarde">Tarde</Select.Item>
                                    <Select.Item value="Completa">Completa</Select.Item>
                                </Select.Content>
                            </Select.Root>

                            {/* Dropdown para Grado */}
                            <Select.Root name="Grado" required onValueChange={setGrado}>
                                <Select.Trigger placeholder="Seleccionar Grado" />
                                <Select.Content>
                                    <Select.Item value="3">3</Select.Item>
                                    <Select.Item value="4">4</Select.Item>
                                    <Select.Item value="5">5</Select.Item>
                                </Select.Content>
                            </Select.Root>

                            {/* Autocompletar GradoT */}
                            <TextField.Root
                                type="text"
                                name="GradoT"
                                value={
                                    grado === "3"
                                        ? "Tercero"
                                        : grado === "4"
                                        ? "Cuarto"
                                        : grado === "5"
                                        ? "Quinto"
                                        : ""
                                }
                                readOnly
                                size="3"
                            />

                            {/* Dropdown dinámico para Id_persona */}
                            <Select.Root name="Id_persona" required>
                                <Select.Trigger placeholder="Seleccionar Persona" />
                                <Select.Content >
                                    {personas.map((persona) => (
                                        <Select.Item key={persona.id} value={persona.Nombre}>
                                            {persona.Nombre}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Root>

                            {/* Dropdown dinámico para Id_institucion */}
                            <Select.Root name="Id_institucion" required>
                                <Select.Trigger placeholder="Seleccionar Institución" />
                                <Select.Content>
                                    {instituciones.map((institucion) => (
                                        <Select.Item key={institucion.id} value={institucion.Nombre}>
                                            {institucion.Nombre}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Root>

                            <TextField.Root type='number' name="Año" placeholder="Año (Ej: 2024)" size="3" required />
                            {error && <p className="text-red-500">{error}</p>}
                            <Button variant="soft" type="submit" className="font-semibold">
                                Crear Aula
                            </Button>
                        </div>
                    </form>
                </Card>
            </main>
        </div>
    );
}
