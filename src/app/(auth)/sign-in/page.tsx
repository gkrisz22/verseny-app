import React from 'react'
import { SignInForm } from '../_components/sign-in-form'
import Icons from '@/components/icons'

const SignInPage = () => {
  return (
      <div className="flex w-full max-w-sm flex-col gap-6 pt-16">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Icons.logo className="size-8" />
          </div>
          Verseny App
        </a>
        <SignInForm />
      </div>
  )
}

export default SignInPage