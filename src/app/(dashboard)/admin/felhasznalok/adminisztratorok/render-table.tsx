"use client";
import { DataTable } from '@/app/(dashboard)/_components/common/data-table'
import React from 'react'
import { columns } from './columns'
import { RowSelectionState } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Organization, User } from '@prisma/client';
import { InviteAdminDialog } from './invite-admin-dialog';
import { PlusIcon } from 'lucide-react';

const RenderUsersTable = ({ users }: { users: User[]}) => {
    return (
        <>
        <DataTable columns={columns} data={users} searchParams={{ column: "name", placeholder: "Keresés név alapján" }}
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