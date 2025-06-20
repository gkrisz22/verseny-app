"use client";
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Organization, User } from '@prisma/client'
import {  User2Icon } from 'lucide-react'
import React from 'react'

const UserOrgs = ({user, orgData }: {user:Partial<User>, orgData: {organization: Organization, roles: { name: string; description: string}[] }[]}) => {
  return (
    <Card className='w-full max-w-xl'>
        <CardHeader>
            <h2 className="text-lg font-semibold">{user.name || user.email} szervezetei</h2>
            <p className="text-sm text-muted-foreground">Az alábbi adatok a felhasználó szervezeteit tartalmazzák.</p>
        </CardHeader>
        <CardContent>
            {
                orgData.map((org) => (
                    <div key={org.organization.id} className='flex items-center gap-2'>
                        <User2Icon className='h-4 w-4' />
                        <span>{org.organization.name}</span>
                        <span className='text-muted-foreground'>({org.roles.map(r => r.description).join(', ')})</span>
                    </div>
                ))
            }
        </CardContent>

    </Card>
  )
}

export default UserOrgs;