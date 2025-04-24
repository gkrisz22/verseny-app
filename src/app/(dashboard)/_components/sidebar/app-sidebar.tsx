"use client"

import * as React from "react"
import {
  AudioWaveform,
  Bot,
  Globe,
  History,
  LayoutGrid,
  PieChart,
  Settings2,
  ShieldCheck,
  University,
  UniversityIcon,
  Users2,
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
  ],
  navCompetitions: [
    {
      title: "Aktuális",
      url: "/admin/versenyek",
      icon: LayoutGrid,
    },
    {
      title: "Korábbi",
      url: "/admin/versenyek/korabbi",
      icon: History,
    }
  ],
  navUserManagement: [
    {
      title: "Szervezetek",
      url: "/admin/felhasznalok/szervezetek",
      icon: University,
    },
    {
      title: "Adminisztrátorok",
      url: "/admin/felhasznalok/adminisztratorok",
      icon: ShieldCheck,
    },
    {
      title: "Összes felhasználó",
      url: "/admin/felhasznalok",
      icon: Users2,
    },
  ],
  navSettings: [
    {
      title: "Tanévek",
      url: "/admin/beallitasok/tanevek",
      icon: Globe,
    }
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} label="Platform" />
        <NavMain items={data.navCompetitions} label="Versenyek" />
        <NavMain items={data.navUserManagement} label="Felhasználók" />
        <NavMain items={data.navSettings} label="Beállítások" />
      </SidebarContent>
     <SidebarFooter className="flex items-end justify-between">
        <SidebarTrigger>
        </SidebarTrigger>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
