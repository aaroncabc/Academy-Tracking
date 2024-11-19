'use client';
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flex, Button, Card, TextField, Select, Heading } from "@radix-ui/themes";

export default function CrearHorarioPage() {
    const [error, setError] = useState<string | null>(null);
    const [horaInicio, setHoraInicio] = useState<string>(""); // Hora inicial ingresada
    const [horasFin, setHorasFin] = useState<string[]>([]); // Opciones dinámicas para hora fin
    const [diaAbrev, setDiaAbrev] = useState<string>(""); // Día abreviado seleccionado
    const [aulas, setAulas] = useState<any[]>([]); // Lista de aulas

    const router = useRouter();

    useEffect(() => {
        // Cargar bloques electivos y aulas desde la API
        async function fetchData() {
            try {
                const [aulasRes] = await Promise.all([
                    fetch("http://localhost:5000/api/getAulas"),
                ]);
                if (aulasRes.ok) {
                    setAulas(await aulasRes.json());
                }
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        }

        fetchData();
    }, []);

    // Actualizar opciones de Hora_f en base a la Hora_i
    useEffect(() => {
        if (!horaInicio) return;
        const [hora, minutos] = horaInicio.split(":").map(Number);
        if (isNaN(hora) || isNaN(minutos)) return;

        const opciones = [45, 50, 60, 90, 100, 120].map((intervalo) => {
            const nuevaHora = new Date(0, 0, 0, hora, minutos + intervalo);
            return nuevaHora.toTimeString().slice(0, 5);
        });

        setHorasFin(opciones);
    }, [horaInicio]);

    // Relacionar día abreviado con su texto completo
    const diasTexto: { [key: string]: string } = {
        L: "Lunes",
        M: "Martes",
        W: "Miércoles",
        J: "Jueves",
        V: "Viernes",
        S: "Sábado",
        D: "Domingo",
    };

    async function crearHorario(formData: FormData) {
        const horaI = formData.get("Hora_i")?.toString();
        const [horas, minutos] = horaI ? horaI.split(":").map(Number) : [0, 0];

        // Validar que la hora de inicio sea válida
        if (isNaN(horas) || horas < 6 || horas > 23 || isNaN(minutos)) {
            setError("La hora de inicio debe ser mayor o igual a las 06:00.");
            return;
        }
        const data = {
            Hora_i: formData.get("Hora_i")?.toString(), 
            Hora_f: formData.get("Hora_f")?.toString(),
            Dia_I: formData.get("Dia_I")?.toString(),
            Dia_text: formData.get("Dia_text")?.toString(),
            Id_Aula: parseInt(formData.get("Id_Aula")?.toString() || "0"),
        };

        const loadingAlert = Swal.fire({
            title: "Creando Horario...",
            text: "Por favor, espere mientras se procesa su solicitud.",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            const res = await fetch("http://localhost:5000/api/createHorario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                setError(errorData.error || "Error inesperado.");
                await Swal.fire({
                    title: "Error",
                    text: errorData.error || "No se pudo crear el horario.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            } else {
                await Swal.fire({
                    title: "Éxito",
                    text: "¡Horario creado exitosamente!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                router.push("/admin/cruds/horarios");
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
                        crearHorario(formData);
                    }}>
                        <div className="flex flex-col gap-6 p-4">
                            <Heading>Crear Horario</Heading>

                            {/* Hora de inicio */}
                            <TextField.Root
                                type="text"
                                name="Hora_i"
                                placeholder="Hora de inicio (HH:mm)"
                                value={horaInicio}
                                onChange={(e) =>  setHoraInicio(e.target.value)}
                                size="3"
                                required
                            />

                            {/* Hora de fin */}
                            <Select.Root name="Hora_f" required>
                                <Select.Trigger placeholder="Seleccionar Hora de Fin" />
                                <Select.Content>
                                    {horasFin.map((hora, index) => (
                                        <Select.Item key={index} value={hora}>
                                            {hora}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Root>

                            {/* Día */}
                            <Select.Root name="Dia_I" required onValueChange={(value) => setDiaAbrev(value)}>
                                <Select.Trigger placeholder="Seleccionar Día" />
                                <Select.Content>
                                    {Object.entries(diasTexto).map(([abrev, texto]) => (
                                        <Select.Item key={abrev} value={abrev}>
                                            {abrev}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Root>

                            {/* Día en texto */}
                            <TextField.Root
                                type="text"
                                name="Dia_text"
                                value={diasTexto[diaAbrev] || ""}
                                readOnly
                                size="3"
                            />


                            {/* Selección de Aula */}
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


                            {error && <p className="text-red-500">{error}</p>}
                            <Button variant="soft" type="submit" className="font-semibold">
                                Crear Horario
                            </Button>
                        </div>
                    </form>
                </Card>
            </main>
        </div>
    );
}
