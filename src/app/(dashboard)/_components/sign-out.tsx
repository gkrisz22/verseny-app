import { signOutAction } from '@/app/_actions/auth.action';
import { signOut } from '@/auth';
import { Button } from '@/components/ui/button'
import React from 'react'

const SignOut = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signOutAction();
      }}
    >
      <Button type="submit">Sign Out</Button>
    </form>
  );
}

export default SignOut