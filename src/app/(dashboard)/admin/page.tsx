"use client";
import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StudentSelector } from '../_components/student-selector/student-selector';
import { Student } from '@/types/student';


const Dashboard = () => {
  const [selectedStudents, setSelectedStudents] = React.useState<Student[]>([])
  return (
    <div>
        <Card>
          <CardHeader>
            <h2 className='text-xl'>Dashboard</h2>
          </CardHeader>
          <CardContent>
          <StudentSelector
                  onSelectMultiple={setSelectedStudents}
                  selectedStudents={selectedStudents}
                  buttonLabel="Select students"
                  multipleSelection={true}
                />
          </CardContent>

     

        </Card>
            

    </div>
  )
}

export default Dashboard