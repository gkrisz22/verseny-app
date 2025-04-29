"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React, { useMemo } from "react";
import { data as NavData } from "./app-sidebar";
import { NavUser } from "./nav-user";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Breadcrumb from "./breadcrumb";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TopNav = ({ user }: { user: User | undefined }) => {
  const pathname = usePathname();

  if (!user) return null;

  return (
    <header className="bg-background flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center justify-between gap-2 w-full container mx-auto">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden -ml-1" />
          <Separator orientation="vertical" className="md:hidden mr-2 h-4 bg-muted-foreground/80" />

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="hidden md:block" onClick={() => window.history.back()}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Előző oldal</span>
            </Button>
            <Button size="sm" variant="outline" className="hidden md:block" onClick={() => window.history.forward()}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Következő oldal</span>
            </Button>
          </div>
          <Separator orientation="vertical" className="md:hidden mr-2 h-4 bg-muted-foreground/80" />
        </div>

        <div className="flex items-center gap-2">
          <NavUser user={user} />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
