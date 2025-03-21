"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Users, Settings, ChevronDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationBell } from "../../_components/notifications/notification-bell";
import { NavUser } from "../../_components/sidebar/nav-user";
import { TeamSwitcher } from "../../_components/sidebar/team-switcher";

const roleLabels = {
  admin: "Administrator",
  contact: "Contact User",
  trusted: "Trusted User",
  teacher: "Teacher",
};

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<React.ComponentProps<"svg">>;
  roles: string[];
  children?: { label: string; href: string, roles: string[] }[];
}

export function TopNavbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems:NavItem[] = [
    {
      label: "Összefoglaló",
      href: "/organization",
      icon: Trophy,
      roles: ["admin", "contact", "trusted", "teacher"],
    },
    {
      label: "Versenyek",
      href: "/organization/versenyek",
      icon: Trophy,
      roles: ["admin", "contact", "trusted", "teacher"],
      children: [
        {
          label: "Aktuális versenyek",
          href: "/organization/versenyek/aktualis",
          roles: ["admin", "contact", "trusted", "teacher"],
        },
        {
          label: "Korábbi versenyek",
          href: "/organization/versenyek/korabbi",
          roles: ["admin", "contact", "trusted", "teacher"],
        },
      ],
    },
    {
      label: "Felhasználók",
      href: "/organization/users",
      icon: Users,
      roles: ["admin"],
    },
    {
      label: "Beállítások",
      href: "/organization/settings",
      icon: Settings,
      roles: ["admin", "contact"],
    },
  ];

  const isActive = (item:NavItem) => {
    if (item.href === pathname) return true;

    if (item.children) {
      return item.children.some((child) =>
        pathname.startsWith(child.href),
      );
    }

    return false;
  };

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          {/*<TeamSwitcher
            teams={[
              { name: "Szervezet 1", logo: Trophy, role: "Admin" },
              { name: "Szervezet 2", logo: Users, role: "Tanár" },
            ]}
          />*/}

          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              

              if (item.children) {
                return (
                  <DropdownMenu key={item.href}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                          isActive(item) ||
                            item.children.some((child) =>
                              pathname === "/organization"
                                ? pathname.startsWith(child.href)
                                : pathname === child.href,
                            )
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link
                            href={child.href}
                            className={cn(
                              pathname.startsWith(child.href) &&
                                "bg-primary/10 text-primary font-medium",
                            )}
                          >
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">{children}</div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t">
        <nav className="flex overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;

            const mobileHref =
              item.children && item.children.length > 0
                ? item.children[0].href
                : item.href;

            return (
              <Link
                key={item.href}
                href={mobileHref}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 p-3 text-xs font-medium",
                  isActive(item)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
