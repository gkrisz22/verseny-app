import { DataTable } from '@/app/(dashboard)/_components/common/data-table'
import { getAllStudentsInCategory } from '@/app/_data/category.data'
import React from 'react'
import { columns } from './columns'

const CategoryStudentsTable = async ({ categoryId }: { categoryId: string }) => {
    const students = await getAllStudentsInCategory(categoryId);
    return (
        <div>
            <DataTable data={students}  columns={columns} searchParams={{column: "name", placeholder: "Keresés diák neve alapján"}} />
        </div>
    )
}

export default CategoryStudentsTable;