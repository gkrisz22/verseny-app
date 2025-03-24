"use client";

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { BadgeInfoIcon, FileTextIcon, LayersIcon, LucideIcon, Trash2, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

interface MenuItem {
    title: string,
    url: string,
    icon?: LucideIcon
}

const _MENU_ITEMS: MenuItem[] = [
  {
    title: 'Alapadatok',
    url: 'alapadatok',
    icon: BadgeInfoIcon
  },
  {
    title: "Kategóriák",
    url: "",
    icon: LayersIcon
  },
  {
    title: "Résztvevők",
    url: "resztvevok",
    icon: UsersIcon
  },
  {
    title: 'Tartalom',
    url: 'tartalom',
    icon: FileTextIcon
  },
]

const LocalVersenyMenu = ({competitionId}: {competitionId: string}) => {
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/\/+$/, '');

  return (
    <ScrollArea className='w-full'>
      <nav className='flex flex-col space-y-2'>
      {
        _MENU_ITEMS
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((item, index) => {
          const itemUrl = `/admin/versenyek/${competitionId}/${item.url}`;
          const normalizedItemUrl = itemUrl.replace(/\/+$/, '');
          const isActive = normalizedPathname === normalizedItemUrl;

          return (
            <Link key={index} href={`/admin/versenyek/${competitionId}/${item.url}`}>
              <Button variant={"ghost"} className={cn('w-full font-medium font-primary inline-flex justify-start', {
                'bg-slate-100 dark:bg-slate-800': isActive,
                'text-slate-600 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-400': !isActive
              })}>
                <span className='inline-flex items-center justify-center w-10 h-10 rounded-full'>
                  {item.icon && <item.icon className='w-5 h-5' />}
                </span>
                <span className='ml-2'>{item.title}</span>
              </Button>
         </Link>
        )})

      }
      <Separator className='my-4' />
      <Button variant="ghost" className='w-full inline-flex justify-start text-destructive'>
        
        
          <span className='inline-flex items-center justify-center w-10 h-10 rounded-full'>
          <Trash2 className='w-4 h-4' />
          </span>
        <span className='ml-2'>Verseny törlése</span>
      </Button>
      </nav>
      
    </ScrollArea>
  )
}

export default LocalVersenyMenu