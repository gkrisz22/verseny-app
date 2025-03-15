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
      url: "/dashboard",
      icon: PieChart,
    },
    {
      title: "Versenyek",
      url: "/versenyek",
      icon: LayoutGrid,
      items: [
        {
          title: "Aktuális",
          url: "/dashboard/versenyek/aktualis",
        },
        {
          title: "Korábbi",
          url: "/dashboard/versenyek/korabbi",
        },
      ],
    },
    {
      title: "Felhasználók",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Összes",
          url: "#",
        },
        {
          title: "Adminisztrátorok",
          url: "#",
        },
        {
          title: "Felügyelők",
          url: "#",
        },
        {
          title: "Iskolák",
          url: "#",
        },
        {
          title: "Tanárok",
          url: "#",
        },
        {
          title: "Diákok",
          url: "#",
        },
      ],
    },
    {
      title: "Publikus oldal",
      url: "#",
      icon: Globe,
      items: [
        {
          title: "Blog",
          url: "#",
        },
        {
          title: "Oldalak",
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
