"use client";

import { ChartColumnIcon, LayersIcon, UsersIcon } from 'lucide-react';
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
];

const LocalOrgStageMenu = ({ children}: { children: React.ReactNode }) => {
  return (
    <div>
      <LocalTabsMenu tabs={_MENU_ITEMS} defaultTab='attekintes' persistent>
        {children}
      </LocalTabsMenu>
    </div>
  )
}

export default LocalOrgStageMenu