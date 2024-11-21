'use client';
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flex, Button, Card, TextField, Select, Heading } from "@radix-ui/themes";
import { useSession } from "next-auth/react";

export default function CrearEstudiantePage() {
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
        router.push('/admin/cruds/estudiante'); // Redirige a "/aulas" si la sesión existe
        }
      }
    }, [session, status, router]);

    const [aulas, setAulas] = useState<any[]>([]); // Lista de aulas desde la API

    useEffect(() => {
        // Obtener las aulas disponibles desde la API
        async function fetchAulas() {
            try {
                const res = await fetch("http://localhost:5000/api/getAulas");
                if (res.ok) {
                    const data = await res.json();
                    setAulas(data);
                }
            } catch (error) {
                console.error("Error al obtener aulas:", error);
            }
        }

        fetchAulas();
    }, []);

    async function crearEstudiante(formData: FormData) {
        const data = {
            Nombre: formData.get("Nombre")?.toString(),
            Segundo_nombre: formData.get("Segundo_nombre")?.toString(),
            Apellido1: formData.get("Apellido1")?.toString(),
            Apellido2: formData.get("Apellido2")?.toString(),
            Tipo_Identificacion: formData.get("Tipo_Identificacion")?.toString(),
            Numero_identificacion: formData.get("Numero_identificacion")?.toString(),
            Genero: formData.get("Genero")?.toString(),
            Estrato: parseInt(formData.get("Estrato")?.toString() || "0"),
            F_nacimiento: formData.get("F_nacimiento")?.toString(),
            Id_Salon: parseInt(formData.get("Id_Salon")?.toString() || "0"),
        };

        const loadingAlert = Swal.fire({
            title: "Creando Estudiante...",
            text: "Por favor, espere mientras se procesa su solicitud.",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            const res = await fetch("http://localhost:5000/api/createEstudiante", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                setError(errorData.error || "Error inesperado.");
                await Swal.fire({
                    title: "Error",
                    text: errorData.error || "No se pudo crear el estudiante.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            } else {
                await Swal.fire({
                    title: "Éxito",
                    text: "¡Estudiante creado exitosamente!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                router.push("/admin/cruds/estudiante");
            }
        } catch (error) {
            setError("Se produjo un error inesperado.");
            await Swal.fire({
                title: "Error",
                text: "Se produjo un error inesperado.",
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            Swal.close();
        }
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <Card variant="classic">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        crearEstudiante(formData);
                    }}>
                        <div className="flex flex-col gap-6 p-4">
                            <Heading>Crear Estudiante</Heading>

                            {/* Información Personal */}
                            <section className="flex flex-col gap-4">
                                <Heading size="3">Información Personal</Heading>
                                <Flex gap={"3"}> 
                                <TextField.Root type="text" name="Nombre" placeholder="Nombre" size="3" required />
                                <TextField.Root type="text" name="Segundo_nombre" placeholder="Segundo Nombre" size="3" />
                                </Flex>  
                                <Flex gap={"3"}>
                                <TextField.Root type="text" name="Apellido1" placeholder="Primer Apellido" size="3" required />
                                <TextField.Root type="text" name="Apellido2" placeholder="Segundo Apellido" size="3" required />
                                </Flex>
                            </section>

                            {/* Identificación */}
                            <section className="flex flex-col gap-4">
                                <Heading size="3">Identificación</Heading>
                                <Select.Root name="Tipo_Identificacion" required>
                                    <Select.Trigger placeholder="Seleccionar Tipo de Identificación" />
                                    <Select.Content>
                                        <Select.Item value="CC">Cédula de ciudadanía</Select.Item>
                                        <Select.Item value="TI">Tarjeta de identidad</Select.Item>
                                        <Select.Item value="PSP">Pasaporte</Select.Item>
                                        <Select.Item value="TE">Tarjeta de extranjería</Select.Item>
                                        <Select.Item value="PEP">Permiso especial de permanencia</Select.Item>
                                        <Select.Item value="DIE">Documento de identificación extranjero</Select.Item>
                                    </Select.Content>
                                </Select.Root>
                                <TextField.Root
                                    type="text"
                                    name="Numero_identificacion"
                                    placeholder="Número de Identificación"
                                    size="3"
                                    required
                                />
                            </section>

                            {/* Detalles Adicionales */}
                            <section className="flex flex-col gap-4">
                                <Heading size="3">Detalles Adicionales</Heading>
                                <Select.Root name="Genero" required>
                                    <Select.Trigger placeholder="Seleccionar Género" />
                                    <Select.Content>
                                        <Select.Item value="Masculino">Masculino</Select.Item>
                                        <Select.Item value="Femenino">Femenino</Select.Item>
                                        <Select.Item value="Otro">Otro</Select.Item>
                                    </Select.Content>
                                </Select.Root>
                                <TextField.Root type="number" name="Estrato" placeholder="Estrato" size="3" required />
                                <TextField.Root
                                    type="date"
                                    name="F_nacimiento"
                                    placeholder="Fecha de Nacimiento"
                                    size="3"
                                    required
                                />
                            </section>

                            {/* Selección de Aula */}
                            <section className="flex flex-col gap-4">
                                <Heading size="3">Asignación de Aula</Heading>
                                <Select.Root name="Id_Salon" required>
                                    <Select.Trigger placeholder="Seleccionar Aula" />
                                    <Select.Content>
                                        {aulas.map((aula) => (
                                            <Select.Item key={aula.id} value={aula.id.toString()}>
                                                {aula.grupoT} ({aula.grupo}) - {aula.grado} - {aula.institucion}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Root>
                            </section>

                            {error && <p className="text-red-500">{error}</p>}
                            <Button variant="soft" type="submit" className="font-semibold">
                                Crear Estudiante
                            </Button>
                        </div>
                    </form>
                </Card>
            </main>
        </div>
    );
}
