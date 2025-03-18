import { signOut } from '@/auth';
import { Button } from '@/components/ui/button'
import React from 'react'

const SignOut = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: '/sign-in' });
      }}
    >
      <Button type="submit">Sign Out</Button>
    </form>
  );
}

export default SignOut