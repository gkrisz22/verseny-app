"use client"

import * as React from "react"
import {
  AudioWaveform,
  Bot,
  Globe,
  LayoutGrid,
  PieChart,
  Settings2,
  UniversityIcon,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Stromfeld Aurél Technikum",
      logo: UniversityIcon,
      role: "Adminisztrátor",
    },
    {
      name: "Táncsics Mihály Technikum",
      logo: AudioWaveform,
      role: "Kapcsolattartó",
    },
  ],
  navMain: [
    {
      title: "Analítika",
      url: "/admin",
      icon: PieChart,
    },
    {
      title: "Versenyek",
      url: "/versenyek",
      icon: LayoutGrid,
      items: [
        {
          title: "Aktuális",
          url: "/admin/versenyek",
        },
        {
          title: "Korábbi",
          url: "/admin/versenyek/korabbi",
        },
      ],
    },
    {
      title: "Felhasználók",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Szervezetek",
          url: "#",
        },
        {
          title: "Adminisztrátorok",
          url: "#",
        },
        {
          title: "Összes felhasználó",
          url: "#",
        },
      ],
    },
    {
      title: "Beállítások",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Integrációk",
          url: "#",
        },
        {
          title: "Tanévek",
          url: "/admin/beallitasok/tanevek",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sidebar = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
     <SidebarFooter className="flex items-end justify-between">
        <SidebarTrigger>
        </SidebarTrigger>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
