"use client";

import { ChartColumnIcon, LayersIcon, SettingsIcon, UsersIcon } from 'lucide-react';
import React from 'react';
import { LocalTabsMenu } from '@/app/(dashboard)/_components/common/local-tabs-menu';


const _MENU_ITEMS = [
  {
    title: 'Beállítások',
    url: 'beallitasok',
    icon: SettingsIcon,
  },
  {
    title: 'Fordulók',
    url: 'fordulok', 
    icon: LayersIcon,
  },
  {
    title: 'Diákok',
    url: 'diakok',
    icon: UsersIcon,
  }
];

const LocalCategoryMenu = ({ children}: { children: React.ReactNode; }) => {
  return (
    <div>
      <LocalTabsMenu tabs={_MENU_ITEMS} defaultTab='fordulok'>
        {children}
      </LocalTabsMenu>
    </div>
  )
}

export default LocalCategoryMenu