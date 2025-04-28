"use client";

import { DataTable } from '@/app/(dashboard)/_components/common/data-table';
import { StudentSelector } from '@/app/(dashboard)/_components/student-selector/student-selector'
import { Student, StudentCategory } from '@prisma/client'
import React from 'react'
import { columns } from './category-student-columns';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { signStudentsUpForCategory } from '@/app/_actions/student.action';
import { toast } from 'sonner';

const CategoryStudentTable = ({ categoryId, students } : { categoryId: string, students: (StudentCategory & { student: Student})[]}) => {
    const [selectedStudents, setSelectedStudents] = React.useState<Student[]>(students.map(s => s.student) || []);

    const addStudents = async () => {
        console.log(selectedStudents)
        const res = await signStudentsUpForCategory(categoryId, selectedStudents.map(s => s.id));
        console.log(res);
        if(res.success) {
            toast.success("Sikeresen jelentkeztél a versenykategóriára!");
            const { students, not_ok, eligibleGrades } = res.data || { students: [], not_ok: [], eligibleGrades: undefined };

            if(not_ok.length > 0) {
                const notOkStudents = not_ok.map((id: string) => selectedStudents.find((s) => s.id === id));
                toast.error("Nem minden diák jelentkezett sikeresen: " + notOkStudents.map((s) => s?.name).join(", ") + ".\n");
            }
        } else {
            toast.error("Hiba történt a jelentkezés során");
        }

        setSelectedStudents([]);
    }

    return (
        <div className='flex flex-col gap-4'>
            <h2 className='text-xl font-semibold'>Diákok</h2>
            <div className='flex flex-col gap-4'>
            <StudentSelector
                  onSelectMultiple={setSelectedStudents}
                  buttonLabel="Diákok kiválasztása"
                  multipleSelection={true}
                  exclude={students.map(s => s.student.id)}
            />
            <Button variant={"outline"} className='w-fit' onClick={addStudents}>
                <UserPlus className='mr-2 h-4 w-4' />
                Kiválasztottak hozzáadása
            </Button>
            <small className='text-muted-foreground'>
                A kiválasztott diákok hozzáadása után automatikusan jelentkezésre kerülnek az első fordulóhoz is.
            </small>
            </div>
            
            <DataTable data={students.map(s => s.student)} columns={columns} searchParams={{
              column: "name",
              placeholder: "Keresés név alapján",
            }}/>
        </div>
    )
}

export default CategoryStudentTable