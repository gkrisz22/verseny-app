import React from 'react'
import { auth } from "@/auth"
import { Card, CardContent, CardHeader } from '@/components/ui/card';


const Dashboard = async () => {
    const session = await auth();

  return (
    <div>
        <Card>
          <CardHeader>
            <h2 className='text-xl'>Dashboard</h2>
          </CardHeader>
          <CardContent>
            <p>Welcome {session?.user?.name}</p>
          </CardContent>

        </Card>
            

    </div>
  )
}

export default Dashboard