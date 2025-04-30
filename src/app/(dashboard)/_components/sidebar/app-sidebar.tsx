"use client"

import * as React from "react"
import {
  Globe,
  HomeIcon,
  LayoutGrid,
  ShieldCheck,
  University,
  Users2,
} from "lucide-react"

import { NavMain } from "./nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import Icons from "@/components/icons"

export const data = {
  navMain: [
    {
      title: "Kezdőoldal",
      url: "/admin",
      icon: HomeIcon,
    },
  ],
  navCompetitions: [
    {
      title: "Versenyek",
      url: "/admin/versenyek",
      icon: LayoutGrid,
    },
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
  const sidebar = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center mt-4 gap-2">
          <Icons.logo className="h-8 w-auto" />
          {sidebar.state !== "collapsed" && <span className="">Verseny App</span>}
        </div>
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
