"use client";
import { DataTable } from '@/app/(dashboard)/_components/common/data-table'
import React from 'react'
import { columns, Participant } from './columns'

const RenderResztvevokTable = ({ participants }: { participants: Participant[] }) => {
    return (
        <DataTable columns={columns} data={participants} searchParams={{ column: "organization", placeholder: "Keresés szervezet neve alapján" }}
        />
    )
}

export default RenderResztvevokTable