"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCogIcon, FileTextIcon, LayersIcon, UsersIcon } from "lucide-react";

const _MENU_ITEMS = [
    {
      title: 'Határidők',
      url: 'hataridok',
      icon: CalendarCogIcon,
    },
    {
      title: 'Kategóriák',
      url: 'kategoriak',
      icon: LayersIcon,
    },
    {
      title: 'Résztvevők',
      url: 'resztvevok',
      icon: UsersIcon,
    },
    {
      title: 'Tartalom',
      url: 'tartalom',
      icon: FileTextIcon,
    },
  ];
  
export function VersenyTabs({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const defaultValue = searchParams.get("tab") || "kategoriak";

    const handleTabChange = (value: string) => {
        router.push(`${pathname}?tab=${value}`);
    };

    return (
        <Tabs defaultValue={defaultValue} onValueChange={handleTabChange}>
            <TabsList>
                {/*<TabsTrigger value="hataridok">Határidők</TabsTrigger>
                <TabsTrigger value="kategoriak">Kategóriák</TabsTrigger>
                <TabsTrigger value="resztvevok">Résztvevők</TabsTrigger>
                <TabsTrigger value="tartalom">Tartalom</TabsTrigger>*/}
                {_MENU_ITEMS.map((item) => (
                    <TabsTrigger key={item.url} value={item.url}>
                        {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                        {item.title}
                    </TabsTrigger>
                ))}
            </TabsList>
            {children}
        </Tabs>
    );
}