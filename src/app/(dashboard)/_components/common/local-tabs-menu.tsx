"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideIcon } from "lucide-react";

interface IMenuItem {
    title: string;
    url: string;
    icon: LucideIcon;
}

export function LocalTabsMenu({
    children,
    tabs,
    additionalTabs,
    defaultTab,
    persistent = false,
}: {
    children: React.ReactNode;
    tabs: IMenuItem[];
    additionalTabs?: React.ReactNode;
    defaultTab?: string;
    persistent?: boolean;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const defaultValue = searchParams.get("tab") || defaultTab || tabs[0].url;
    const [activeTab, setActiveTab] = React.useState<string>(defaultValue);

    const handleTabChange = React.useCallback((value: string) => {
        if (persistent) {
            router.push(`${pathname}?tab=${value}`);
        }
        setActiveTab(value);
    }, [persistent, router, pathname]);

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
            const isCmd = isMac ? event.metaKey : event.ctrlKey;

            if (isCmd) {
                const number = parseInt(event.key);
                if (!isNaN(number) && number >= 1 && number <= tabs.length) {
                    const tabIndex = number - 1;
                    const selectedTab = tabs[tabIndex];
                    if (selectedTab) {
                        handleTabChange(selectedTab.url);
                        event.preventDefault();
                    }
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [tabs, pathname, router, handleTabChange]);

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
                {tabs.map((item) => (
                    <TabsTrigger key={item.url} value={item.url}>
                        {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                        {item.title}
                    </TabsTrigger>
                ))}
                {additionalTabs}
            </TabsList>
            {children}
        </Tabs>
    );
}
