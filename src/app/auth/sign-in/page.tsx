import { ToggleTheme } from '@/components/ui/theme-toggler'
import Link from 'next/link'
import React from 'react'

const SignInPage = () => {
  return (
    <div>
        <ToggleTheme />

        <Link href="/auth/sign-up">
            Sign Up
        </Link> 
    </div> 
  )
}

export default SignInPage