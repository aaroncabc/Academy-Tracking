// app/asistencias/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Flex, Text, Grid, Card, Badge, Heading } from "@radix-ui/themes";
import { SessionProvider, useSession } from "next-auth/react";
import { truncate } from 'fs';

export default function AsistenciasPage() {
  return (
    <SessionProvider>
      <Asistencias />
    </SessionProvider>
  );
}

function Asistencias() {
  interface TutorData {
    grupo: string;
    gradot: string;
    grado: number;
    institucion: string;
  }

  const { data: session } = useSession();
  const [data, setData] = useState<TutorData[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/aulas')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  
  // En el return, asegúrate de que `rol` se muestra en el div:
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <p><strong>Nombre de usuario:</strong> {session?.user?.name}</p>
          <p><strong>Rol:</strong> {session?.user?.email}</p> {/* Muestra el valor de `rol` */}
        </div>
        <Grid columns="3" gap="3" rows="repeat(2, 160px)" width="auto">
          {data.length > 0 ? (
            data.map((item, index) => (
              <Card key={index}>
                <Heading><strong>Grupo:</strong> {item.grupo}</Heading>
                <Badge><strong>Grado:</strong> {item.gradot} ({item.grado}°)</Badge>
                <Flex direction={"column"} pt={"20px"}>
                  <Text wrap={"pretty"}><strong>Institución:</strong> {item.institucion}</Text>
                </Flex>
              </Card>
            ))
          ) : (
            <p>Cargando datos...</p>
          )}
        </Grid>
        
      </main>
    </div>
  );
}
