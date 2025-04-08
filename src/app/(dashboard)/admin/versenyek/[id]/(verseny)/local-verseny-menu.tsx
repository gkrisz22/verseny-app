"use client";

import { Button } from '@/components/ui/button';
import LocalSideMenu from '@/app/(dashboard)/_components/common/local-side-menu';
import { CalendarCogIcon, FileTextIcon, LayersIcon, Trash2, UsersIcon } from 'lucide-react';
import React from 'react';
import { ConfirmDialog } from '@/app/(dashboard)/_components/common/confirm-dialog';

const _MENU_ITEMS = [
  {
    title: 'Határidők',
    url: 'hataridok',
    icon: CalendarCogIcon,
  },
  {
    title: 'Kategóriák',
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

const LocalVersenyMenu = ({ competitionId }: { competitionId: string }) => {
  const [open, setOpen] = React.useState(false);
  const handleConfirm = () => {
    setOpen(false);


  };
  return (
    <LocalSideMenu items={_MENU_ITEMS} basePath={`/admin/versenyek/${competitionId}/`}>
      <LocalSideMenu.Footer>

        <ConfirmDialog open={open} setOpen={setOpen} title="Verseny törlése" description="Biztosan törölni szeretné ezt a versenyt?"
        confirmButton={
          <Button variant="destructive"  onClick={handleConfirm}>
            Törlés
          </Button>}
          >
          <Button variant="ghost" className="w-full inline-flex justify-start text-destructive">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full">
                <Trash2 className="w-4 h-4" />
              </span>
              <span className="ml-2">Verseny törlése</span>
          </Button>
        </ConfirmDialog>
      </LocalSideMenu.Footer>
    </LocalSideMenu>
  );
};

export default LocalVersenyMenu;