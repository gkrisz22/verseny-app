"use client";

import { FileTextIcon, LayersIcon, SettingsIcon, UsersIcon } from 'lucide-react';
import React from 'react';
import { LocalTabsMenu } from '@/app/(dashboard)/_components/common/local-tabs-menu';
import { DeleteCompetitionDialog } from './delete-competition-dialog';

const _MENU_ITEMS = [
  {
    title: 'Beállítások',
    url: 'beallitasok',
    icon: SettingsIcon,
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


const LocalCompetitionMenu = ({ children }: { children: React.ReactNode; }) => {
  return (
    <div>
      <LocalTabsMenu tabs={_MENU_ITEMS} defaultTab='kategoriak'>
        {children}
      </LocalTabsMenu>
    </div>
  )
}

export default LocalCompetitionMenu