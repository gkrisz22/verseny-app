"use client";
import { DataTable } from '@/app/(dashboard)/_components/common/data-table'
import React from 'react'
import { columns } from './columns'
import { RowSelectionState } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { NotificationDialog } from '@/app/(dashboard)/_components/notifications/notification-dialog';
import { Organization, User } from '@prisma/client';
import { InviteAdminDialog } from './invite-admin-dialog';
import { PlusIcon } from 'lucide-react';

const RenderUsersTable = ({ users }: { users: User[]}) => {
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
        <DataTable columns={columns} data={users} searchParams={{ column: "name", placeholder: "Keresés név alapján" }}
            onRowSelectionChange={setSelectedRows}
            selectedRows={selectedRows}
            addButton={
                <InviteAdminDialog>
                    <Button variant="default" size="sm" className="w-full">
                        <PlusIcon /> Új adminisztrátor meghívása
                    </Button>
                </InviteAdminDialog>
            }
        />
        </>
    )
}

export default RenderUsersTable