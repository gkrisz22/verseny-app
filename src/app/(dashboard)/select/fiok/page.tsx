import React from 'react'
import ProfilForm from './profil-form'
import { getUserProfile } from '@/app/_data/user.data'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

const FiokPage = async () => {
  const user = await getUserProfile();
  if(!user) {
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-2xl font-bold'>Hiba történt</h1>
      <p className='mt-4 text-gray-600'>Nem található a felhasználói fiók.</p>
    </div>
  }

  return (
    <div className='flex flex-col items-center  h-screen'>
      <h1 className='text-2xl font-bold'>Felhasználói fiók beállítások</h1>
      <p className='mt-4 text-gray-600'>Itt tudja módosítani a felhasználói fiókjával kapcsolatos beállításokat.</p>
    

      {user && <ProfilForm user={user} />}

      <Link href="/select">
        <Button className='mt-4' variant='link' size={"sm"}>
          <ArrowLeftIcon className='mr-2' />
          Vissza a szervezetválasztáshoz
        </Button>
      </Link>
    </div>
  )
}

export default FiokPage