"use client";
import * as React from "react"
import {
  AudioWaveform,
  User,
  ClipboardList,
  BookOpen,
  GraduationCap,
  Apple,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  AlarmClock
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { title } from "process"
import { useRouter } from "next/navigation"
import { Session } from "inspector/promises"
import { SessionProvider, useSession } from "next-auth/react"
import { url } from "inspector";

//datos de ejemplo para usuarios
const data = { 
  navMain: [
    {
      title: "General",
      url: "#",
      icon: ClipboardList,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Aulas",
          url: "/admin/aulas",
        }
      ],
    },
    {
      title: "Tutores",
      url: "#",
      icon: Apple,
      items: [
        {
          title: "Añadir Tutor",
          url: "/admin/cruds/persona",
        },
        {
          title: "Consultar Tutores",
          url: "#",
        },

      ],
    },
{
  title: "Estudiantes",
  url: "#",
  icon: BookOpen,
  items: [
    {
      title: "Añadir Estudiante",
      url: "/admin/cruds/estudiante",
    },
    {
      title: "Consultar Estudiantes",
      url: "#",
    },
    {
      title: "Consultar Notas",
      url: "#",
    },
    {
      title: "Consultar Asistencias",
      url: "#",
    }
  ],
},
{
  title: "Aulas",
  url: "#",
  icon: GraduationCap,
  items: [
    {
      title: "Añadir Aula",
      url: "/admin/cruds/aula",
    },
    {
      title: "Actualizar Aulas",
      url: "#",
    },
  ],
},
  ],
}

const data2 = { 
  navMain: [
    {
      title: "General",
      url: "#",
      icon: ClipboardList,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Aulas",
          url: "/tutor/aulas",
        },
        {
          title: "Notas",
          url: "/tutor/notas",
        }
      ],
    },{
    title: "Horario",
    url: "#",
    icon: AlarmClock,
    items: [
      {
        title: "Mi semana",
        url: "#",
      }
    ],
  },{
      title: "Estudiantes",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Consultar Notas",
          url: "#",
        },
        {
          title: "Consultar Asistencias",
          url: "#",
        }
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return(
    <SessionProvider>
      <AppSidebarComponent {...props} />
    </SessionProvider>
  )
}



function AppSidebarComponent({ ...props }: React.ComponentProps<typeof Sidebar>) {
 
  const router = useRouter();
  const { data: session,status} = useSession();
    return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={session?.user?.email?.trim() === "admin" ? data.navMain : data2.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: session?.user?.name?.split(' ')[1] || '' }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
