import React from 'react'
import { SignInForm } from '../_components/sign-in-form'

const SignInPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignInForm />
      </div>
    </div>
  )
}

export default SignInPage