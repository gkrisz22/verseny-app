"use client";

import { Button } from '@/components/ui/button';
import LocalSideMenu from '@/app/(dashboard)/_components/common/local-side-menu';
import { BadgeInfoIcon, FileTextIcon, LayersIcon, Trash2, UsersIcon } from 'lucide-react';
import React from 'react';

const _MENU_ITEMS = [
  {
    title: 'Alapadatok',
    url: 'alapadatok',
    icon: BadgeInfoIcon,
  },
  {
    title: 'Fordulók',
    url: '',
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

const LocalKategoriaMenu = ({ competitionId }: { competitionId: string }) => {
  return (
    <LocalSideMenu items={_MENU_ITEMS} basePath={`/admin/versenyek/${competitionId}/`}>
      
      <LocalSideMenu.Footer>
        <Button variant="ghost" className="w-full inline-flex justify-start text-destructive">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full">
            <Trash2 className="w-4 h-4" />
          </span>
          <span className="ml-2">Verseny törlése</span>
        </Button>
      </LocalSideMenu.Footer>

      <LocalSideMenu.Previous href={`/admin/versenyek/${competitionId}/`}>
        Vissza a versenyhez
      </LocalSideMenu.Previous>
    </LocalSideMenu>
  );
};

export default LocalKategoriaMenu;