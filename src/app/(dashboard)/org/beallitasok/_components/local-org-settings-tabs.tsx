"use client";

import { ChartColumnIcon, LayersIcon, SettingsIcon, UniversityIcon, UsersIcon } from 'lucide-react';
import React from 'react';
import { LocalTabsMenu } from '@/app/(dashboard)/_components/common/local-tabs-menu';


const _MENU_ITEMS = [
  {
    title: 'Szervezeti profil',
    url: 'profil',
    icon: UniversityIcon,
  },
  {
    title: 'Felhasználók',
    url: 'felhasznalok', 
    icon: UsersIcon,
  },
];

const LocalOrgSettingsMenu = ({ children}: { children: React.ReactNode; }) => {
  return (
    <div>
      <LocalTabsMenu tabs={_MENU_ITEMS} defaultTab='profil' persistent>
        {children}
      </LocalTabsMenu>
    </div>
  )
}

export default LocalOrgSettingsMenu