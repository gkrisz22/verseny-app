"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

interface MenuItem {
    title: string;
    url: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface LocalSideMenuProps {
    items: MenuItem[];
    basePath: string;
    children?: ReactNode;
}

interface LocalSideMenuComponent extends React.FC<LocalSideMenuProps> {
    Previous: React.FC<{ children: React.ReactNode, href: string }>;
    Footer: React.FC<{ children: React.ReactNode }>;
}

const LocalSideMenu: LocalSideMenuComponent = ({
    items,
    basePath,
    children,
}: LocalSideMenuProps) => {
    const pathname = usePathname();
    const normalizedPathname = pathname.replace(/\/+$/, "");

    return (
        <div className="w-full">
            <nav className="flex flex-col md:flex-row">
                {items
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((item, index) => {
                        const itemUrl = `${basePath}${item.url}`.replace(
                            /\/+$/,
                            ""
                        );
                        const isActive = normalizedPathname === itemUrl;

                        return (
                            <div className="flex items-center" key={index}>
                            <Link key={index} href={itemUrl}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full font-medium font-primary inline-flex justify-start",
                                        {
                                            "bg-slate-100 dark:bg-slate-800":
                                                isActive,
                                            "text-slate-600 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-400":
                                                !isActive,
                                        }
                                    )}
                                >
                                    <span className="inline-flex items-center justify-center w-5 h-10 rounded-full">
                                        {item.icon && (
                                            <item.icon className="w-5 h-5" />
                                        )}
                                    </span>
                                    <span className="ml-1">{item.title}</span>
                                </Button>
                            </Link>
                            <Separator orientation="vertical" className=" mx-2 h-4 bg-muted-foreground/80" />
                            </div>
                        );
                    })}
                {children}
            </nav>
        </div>
    );
};

LocalSideMenu.Previous = ({ children, href }: { children: React.ReactNode, href: string }) => {
    return (
        <div className="flex flex-col space-y-0.5">
            <Link href={href} className="text-sm font-medium text-muted-foreground">
            <Button variant="link" className="text-muted-foreground">
                {children}
            </Button>
            </Link>
        </div>
    );
};

LocalSideMenu.Previous.displayName = "LocalSideMenu.Previous";

LocalSideMenu.Footer = ({ children }: { children: React.ReactNode }) => {
    return <div className="">{children}</div>;
};
LocalSideMenu.Footer.displayName = "LocalSideMenu.Footer";

export default LocalSideMenu;
