"use client"

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

//datos de ejemplo para usuarios
const data = {
  user: {
    name: "Usuario",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  
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
          title: "Profesores",
          url: "#",
        },
        {
          title: "Escuelas",
          url: "#",
        },
        {
          title: "Estudiantes",
          url: "#",
        },
      ],
    },
    {
      title: "Profesores",
      url: "#",
      icon: Apple,
      items: [
        {
          title: "Añadir Profesor",
          url: "#",
        },
        {
          title: "Consultar Profesores",
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
      url: "#",
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
  title: "Salones",
  url: "#",
  icon: GraduationCap,
  items: [
    {
      title: "Añadir Salon",
      url: "#",
    },
    {
      title: "Consultar Salones",
      url: "#",
    },
  ],
}
,
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
