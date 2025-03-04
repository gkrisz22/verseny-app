"use client";

import { ChevronRight, Plus, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;
          const isActive =
            pathname === item.url ||
            item.items?.some((sub) => pathname === sub.url);

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className={`group/collapsible ${state === "collapsed" ? "p-0" : "p-2"}`}
            >
              <SidebarMenuItem>
                {hasSubItems ? (
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} size={"default"}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>

                      <div className="flex items-center ml-auto gap-2">
                      <span  className="rounded-full p-[.25rem] bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Add new item");
                      }}>
                        <Plus className=" h-4 w-4" />

                      </span>


  
                      <ChevronRight className="h-5 w-5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </div>

                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                ) : (
                  <Link href={item.url} className="w-full">
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                )}
                {hasSubItems && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
