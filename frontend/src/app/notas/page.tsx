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

interface Note {
  id: number;
  title: string;
  content: string;
}

interface Student {
  grupo: number;
  estudiante: string;
  nota_1: number;
}

const StudentNotesPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudentNotes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/ANotas');
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error al obtener las notas de los estudiantes:', error);
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
                  <BreadcrumbLink href="#">Estudiante</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Notas</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <h1>Notas de los Estudiantes</h1>
            {students.length > 0 ? (
              students.map((student) => (
                <div key={student.grupo}>
                  <h2>{student.estudiante}</h2>
                  <pre>{JSON.stringify(student.nota_1, null, 2)}</pre>
                </div>
              ))
            ) : (
              <p>No hay notas de estudiantes disponibles.</p>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default StudentNotesPage;