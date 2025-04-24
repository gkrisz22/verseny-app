"use client";
import FormField from '@/app/(dashboard)/_components/common/form-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { User } from '@prisma/client'
import { MailIcon, User2Icon } from 'lucide-react'
import React from 'react'

const AdatlapForm = ({ user }: { user: Partial<User>}) => {
  return (
    <Card className='w-full max-w-xl'>
        <CardHeader>
            <h2 className="text-lg font-semibold">{user.name || user.email} adatai</h2>
            <p className="text-sm text-muted-foreground">Az alábbi adatok a felhasználó profilját tartalmazzák.</p>
        </CardHeader>
        <CardContent>
            <form className="grid  gap-4">
                <FormField type='text' name='name' id='name' label='Név' placeholder='Név' colSpan={1} required defaultValue={user.name || ""} Icon={User2Icon} />
                <FormField type='text' name='email' id='email' label='E-mail cím' placeholder='E-mail cím' colSpan={1} required defaultValue={user.email || ""} Icon={MailIcon} />
                <FormField type='switch' name='isActive' id='isActive' label='Aktív felhasználó' colSpan={1} defaultValue={user.status == "ACTIVE" ? "true" : "false"} />
                <FormField type='switch' name="isSuperAdmin" id="isSuperAdmin" label="Adminisztrátor" colSpan={1} defaultValue={user.superAdmin ? "true" : "false"} />
                <p className="text-sm text-muted-foreground">Regisztrálás dátuma: {user.createdAt?.toLocaleString("hu-HU")}</p>
                <Button type="submit" className="w-full" disabled={false}>
                    Mentés
                </Button>
            </form>
        </CardContent>

    </Card>
  )
}

export default AdatlapForm