'use client';
import { AppSidebar } from "@/components/app-sidebar"
import  StudentCountCard from "@/components/ui/Count"
import SchoolCard from "@/components/ui/School"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SessionProvider } from "next-auth/react"

export default function Page() {
  return (  
    <>
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      
        <StudentCountCard count={1000} texto="Estudiantes" />
      
        <StudentCountCard count={200} texto="Profesores"/>
        <SchoolCard/>
    </div>
    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
  </div>
  </>
  )
}
