'use client';

import React, { useState, useEffect } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import StudentCountCard from "@/components/ui/Count";
import SchoolCard from "@/components/ui/School";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface School {
    id_instituciones: number;
    nombre: string;
  }

const SchoolsNotesPage: React.FC = () => {
  const [schools, setschool] = useState<School[]>([]);

  useEffect(() => {
    const fetchStudentNotes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/escuelas');
        const data = await response.json();
        setschool(data);
      } catch (error) {
        console.error('Error al obtener profesores: ', error);
      }
    };

    fetchStudentNotes();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Nombre</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Institucion</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            {schools.length > 0 ? (
              schools.map((school) => (
                <div key={school.id_instituciones}>
                  <h2>{school.nombre}</h2>

                </div>
              ))
            ) : (
              <p>No hay escuelas disponibles</p>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SchoolsNotesPage;