"use client";

import { ChartColumnIcon, LayersIcon, SettingsIcon, UsersIcon } from 'lucide-react';
import React from 'react';
import { LocalTabsMenu } from '@/app/(dashboard)/_components/common/local-tabs-menu';

const _MENU_ITEMS = [
  {
    title: 'Áttekintés',
    url: 'attekintes',
    icon: ChartColumnIcon,
  },
  {
    title: 'Feladatok',
    url: 'feladatok',
    icon: LayersIcon,
  },
  {
    title: 'Diákok',
    url: 'diakok',
    icon: UsersIcon,
  },
  {
    title: 'Adminisztráció',
    url: 'adminisztracio',
    icon: SettingsIcon,
  },
];

const LocalStageMenu = ({ children}: { children: React.ReactNode }) => {
  return (
    <div>
      <LocalTabsMenu tabs={_MENU_ITEMS} defaultTab='attekintes'>
        {children}
      </LocalTabsMenu>
    </div>
  )
}

export default LocalStageMenu