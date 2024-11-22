'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation";
import { Flex, Text, Button, Heading, TextField } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

interface NotaData {
  id_std: number;
  nombre_completo: string;
  nota_1: number;
  nota_2: number;
  nota_3: number;
  nota_4: number;
}

export default function AulaPage() {
  return (
    <Aula />
  );
}

function Aula() {
  const params = useParams();
  const aula = params.id_aula;
  const { data: session, status } = useSession();
  const router = useRouter();

  const [data, setData] = useState<NotaData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirige si no hay sesión activa
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  const apiUrl = aula ? `http://localhost:5000/api/notas/${aula}` : '';

  // Cargar datos de la API
  useEffect(() => {
    if (!aula) return;

    fetch(apiUrl)
      .then(response => response.json())
      .then((data: NotaData[]) => {
        const initializedData = data.map(item => ({
          ...item,
          nota_1: item.nota_1 ?? 0,
          nota_2: item.nota_2 ?? 0,
          nota_3: item.nota_3 ?? 0,
          nota_4: item.nota_4 ?? 0,
        }));
        setData(initializedData);
      })
      .catch(() => Swal.fire("Error", "No se pudieron cargar los datos", "error"));
  }, [aula]);

  // Manejar cambios en las notas
  const handleInputChange = (index: number, field: keyof NotaData, value: number) => {
    setData(prevData =>
      prevData.map((item, i) =>
        i === index ? { ...item, [field]: value || 0 } : item
      )
    );
  };

  // Enviar los datos actualizados a la API
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Asegurarse de que cada objeto tenga todos los campos necesarios (incluido `id_std`)
      const updatedData = data.map(item => ({
        id_std: item.id_std, // Aseguramos que id_std esté presente
        Nota_1: item.nota_1,
        Nota_2: item.nota_2,
        Nota_3: item.nota_3,
        Nota_4: item.nota_4,
      }));

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData) // Enviar los datos con id_std
      });

      if (response.ok) {
        Swal.fire("Éxito", "Notas actualizadas correctamente", "success");
      } else {
        throw new Error("Error al actualizar las notas");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudieron actualizar las notas", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-start sm:items-start">
        <Heading>Notas de los Alumnos</Heading>
        <form>
          <div className="flex flex-col gap-4 p-4">
            {data.length > 0 ? (
              data.map((item, index) => (
                <Flex direction="column" key={item.id_std} className="gap-4">
                  <Heading>{item.nombre_completo}</Heading>
                  <div className="flex gap-4">
                    <TextField.Root
                        type="number"
                        value={item.nota_1}
                        onChange={(e) => handleInputChange(index, 'nota_1', parseFloat(e.target.value))}
                        placeholder="Nota 1"
                    />
                    <TextField.Root
                        type="number"
                        value={item.nota_2}
                        onChange={(e) => handleInputChange(index, 'nota_2', parseFloat(e.target.value))}
                        placeholder="Nota 2"
                    />
                    <TextField.Root
                        type="number"
                        value={item.nota_3}
                        onChange={(e) => handleInputChange(index, 'nota_3', parseFloat(e.target.value))}
                        placeholder="Nota 3"
                    />
                    <TextField.Root
                        type="number"
                        value={item.nota_4}
                        onChange={(e) => handleInputChange(index, 'nota_4', parseFloat(e.target.value))}
                        placeholder="Nota 4"
                    />
                  </div>
                </Flex>
              ))
            ) : (
              <Text>Cargando datos...</Text>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar Notas"}
          </Button>
        </form>
      </main>
    </div>
  );
}
