"use client";
import FormField from '@/app/(dashboard)/_components/common/form-field'
import { updateUser } from '@/app/_actions/user.action';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useActionForm } from '@/hooks/use-action-form';
import { User } from '@prisma/client'
import { Loader2Icon, MailIcon, User2Icon } from 'lucide-react'
import React from 'react' 

const AdatlapForm = ({ user }: { user: Partial<User>}) => {
    const [state, action, isLoading] = useActionForm(updateUser);
  return (
    <Card className='w-full max-w-xl'>
        <CardHeader>
            <h2 className="text-lg font-semibold">{user.name || user.email} adatai</h2>
            <p className="text-sm text-muted-foreground">Az alábbi adatok a felhasználó profilját tartalmazzák.</p>
        </CardHeader>
        <CardContent>
            <form className="grid  gap-4" action={action}>
                <input type="hidden" name="id" id="id" defaultValue={user.id} />
                <FormField type='text' name='name' id='name' label='Név' placeholder='Név' colSpan={1} required defaultValue={state?.inputs?.name || user.name || ""} Icon={User2Icon} errors={state?.errors?.name} />
                <FormField type='text' name='email' id='email' label='E-mail cím' placeholder='E-mail cím' colSpan={1} required defaultValue={state?.inputs?.email ||  user.email || ""} Icon={MailIcon} errors={state?.errors?.email} />
                <FormField type='switch' name='isActive' id='isActive' label='Aktív felhasználó' colSpan={1} defaultValue={state?.inputs?.isActive || user.status === 'ACTIVE'} errors={state?.errors?.isActive} />
                <FormField type='switch' name="superAdmin" id="superAdmin" label="Adminisztrátor" colSpan={1} defaultValue={state?.inputs?.superAdmin || user.superAdmin} errors={state?.errors?.superAdmin} /> 
                <p className="text-sm text-muted-foreground">Regisztrálás dátuma: {user.createdAt?.toLocaleString("hu-HU")}</p> 
                <Button type="submit" className="w-full" disabled={isLoading} variant="default">
                    {isLoading && <span className="animate-spin mr-2"><Loader2Icon className="h-4 w-4" /></span>} 
                    Mentés
                </Button>  
            </form>   
        </CardContent>   

    </Card> 
  )
}

export default AdatlapForm