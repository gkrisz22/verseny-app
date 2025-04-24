"use client";
import { DataTable } from '@/app/(dashboard)/_components/common/data-table'
import React from 'react'
import { columns } from './columns'
import { RowSelectionState } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { NotificationDialog } from '@/app/(dashboard)/_components/notifications/notification-dialog';
import { Organization } from '@prisma/client';

const RenderSzervezetekTable = ({ organizations }: { organizations:( Organization & {_count: {
    members: number;
};})[] }) => {
    const [selectedRows, setSelectedRows] = React.useState<RowSelectionState>({});
    const [emails, setEmails] = React.useState<string[]>([]);

    React.useEffect(() => {
        console.log(selectedRows);
    }, [selectedRows])

    const sendNotification = () => {

        
    }

    return (
        <>
        <NotificationDialog emails={emails}>
            <Button variant={"outline"} onClick={sendNotification} className="mb-4">
                Értesítés küldése
            </Button>
        </NotificationDialog>
        <DataTable columns={columns} data={organizations} searchParams={{ column: "name", placeholder: "Keresés szervezetnév alapján" }}
            onRowSelectionChange={setSelectedRows}
            selectedRows={selectedRows}
        />
        </>
    )
}

export default RenderSzervezetekTable