"use client";
import { DataTable } from '@/app/(dashboard)/_components/common/data-table'
import React from 'react'
import { columns, Participant } from './columns'
import { RowSelectionState } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { NotificationDialog } from '@/app/(dashboard)/_components/notifications/notification-dialog';

const RenderResztvevokTable = ({ participants }: { participants: Participant[] }) => {
    const [selectedRows, setSelectedRows] = React.useState<RowSelectionState>({});
    const [emails, setEmails] = React.useState<string[]>([]);

    React.useEffect(() => {
        console.log(selectedRows);
    }, [selectedRows])

    const sendNotification = () => {

        const keys = Object.keys(selectedRows).map((key) => parseInt(key));
        const selectedParticipants = participants.filter((_, index) => keys.includes(index))
        console.log(selectedParticipants);
        const emails = selectedParticipants.map((participant) => participant.contactEmail).filter((email) => email !== null) as string[];
        setEmails(emails);
    }

    return (
        <>
        
        <NotificationDialog emails={emails}>
            <Button variant={"outline"} onClick={sendNotification} className="mb-4">
                Értesítés küldése
            </Button>
        </NotificationDialog>
        <DataTable columns={columns} data={participants} searchParams={{ column: "organization", placeholder: "Keresés kategória név alapján" }}
            onRowSelectionChange={setSelectedRows}
            selectedRows={selectedRows}
        />
        </>
    )
}

export default RenderResztvevokTable