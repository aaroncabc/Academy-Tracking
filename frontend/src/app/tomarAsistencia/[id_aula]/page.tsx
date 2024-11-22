'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation";
import { Flex, Text, Button, Card, Checkbox, Heading, TextField } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function AulaPage() {
  return (
    <Aula />
  );
}

function Aula() {
  interface EstudianteData {
    id_std: string;
    nombre: string;
    snombre: string;
    apellido1: string;
    apellido2: string;
  }

  const params = useParams();
  const aula = params.id_aula;
  const { data: session, status } = useSession();
  const router = useRouter();

  const [data, setData] = useState<EstudianteData[]>([]);
  const [esTutor, setEsTutor] = useState<boolean>(false);
  const [asistencias, setAsistencias] = useState<{ [id: string]: boolean }>({});
  const [atutor, setAtutor] = useState<boolean>(true);
  const [motivo, setMotivo] = useState<string>('');

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/login');
    } else {
      fetch(`http://localhost:5000/api/esTutor?tutor=${session?.user?.name?.split(' ')[0]}&aula=${aula}`)
        .then(response => response.json())
        .then(data => {
          setEsTutor(data);
          if (!data && session?.user?.email?.trim() !== "admin") {
            router.push('/denegado');
          }
        });
    }
  }, [session, status, router]);

  useEffect(() => {
    if (aula) {
      fetch(`http://localhost:5000/api/listaAlumnos?aula=${aula}`)
        .then(response => response.json())
        .then(data => {
          setData(data);
          // Inicializar el estado de asistencias con "false" para cada estudiante
          const initialAsistencias = data.reduce((acc: { [id: string]: boolean }, student: EstudianteData) => {
            acc[student.id_std] = false;
            return acc;
          }, {});
          setAsistencias(initialAsistencias);
        });
    }
  }, [aula]);

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setAsistencias((prev) => ({ ...prev, [id]: checked }));
  };

  const handleAtutorChange = (checked: boolean) => {
    setAtutor(checked);
    if (checked) {
      setMotivo('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!atutor && !motivo.trim()) {
      Swal.fire('Error', 'Debe proporcionar un motivo si el tutor no asistió.', 'error');
      return;
    }

    const fechaActual = new Date().toISOString().split('T')[0];
    const asistenciasArray = Object.keys(asistencias).map(id => ({
      id_std: id,
      asistencia: asistencias[id],
    }));

    const payload = {
      aula: aula,
      asistencias: asistenciasArray,
      fecha: fechaActual,
      tutor: session?.user?.name?.split(' ')[0],
      atutor: atutor,
      motivo: !atutor ? motivo : null,
    };

    try {
      const response = await fetch('http://localhost:5000/api/tomarAsistencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Swal.fire('Éxito', 'Asistencia registrada correctamente', 'success');
      } else {
        const errorData = await response.json();
        Swal.fire('Error', errorData.details, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Ocurrió un problema con la solicitud', 'error');
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-start sm:items-start">
        <Heading>Toma de Asistencia</Heading>
        <form onSubmit={handleSubmit} className="w-full">
          <Flex direction="column" gap="4">
            {session?.user?.email?.trim() === "admin" && (
              <Flex direction="column" gap="4" className="mt-4">
                <Flex gap={"3"} align={"center"}>
                  ¿El tutor asistió?
                  <Checkbox
                    id="atutor-checkbox"
                    checked={atutor}
                    onCheckedChange={handleAtutorChange}
                  />
                </Flex>
                {!atutor && (
                  <TextField.Root
                    placeholder="Motivo de inasistencia del tutor"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    required
                  />
                )}
              </Flex>
            )}
            {data.length > 0 ? (
              data.map((item) => (
                <Card key={item.id_std} variant="ghost" className="flex items-center justify-between">
                  <Text>
                    {item.nombre} {item.snombre ? item.snombre : ''} {item.apellido1} {item.apellido2}
                  </Text>
                  <Checkbox
                    id={`asistencia-${item.id_std}`}
                    checked={asistencias[item.id_std] || false}
                    onCheckedChange={(checked) => handleCheckboxChange(item.id_std, !!checked)}
                  />
                </Card>
              ))
            ) : (
              <Text>Cargando datos...</Text>
            )}
          </Flex>
          <Button type="submit" className="mt-4">
            Enviar Asistencia
          </Button>
        </form>
      </main>
    </div>
  );
}
