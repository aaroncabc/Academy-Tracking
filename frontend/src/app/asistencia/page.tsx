'use client';
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { Flex, Text, Button, Grid,Card,Badge,Heading } from "@radix-ui/themes";


export default function Asistencias() {
  interface TutorData {
    grupo: string;
    gradot: string;
    grado: number;
    institucion: string;
}

  const [data, setData] = useState<TutorData[]>([]);

  useEffect(() => {
      fetch('http://localhost:5000/api/aulas')  // URL de la API Flask
          .then(response => response.json())
          .then(data => setData(data));
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
    <Grid columns="3" gap="3" rows="repeat(2, 160px)" width="auto">
    {data? (
          data.map((item, index) => (
            <Card key={index} >
                <Heading><strong>Grupo:</strong> {item.grupo}</Heading>
                <Badge ><strong>Grado:</strong> {item.gradot} ({item.grado}°)</Badge>
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