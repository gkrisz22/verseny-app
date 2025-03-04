import React from 'react'
import Icons from '@/components/icons'
import { TwoFactorForm } from '../../_components/two-factor-form'

const SignInPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Icons.logo className="size-8" />
          </div>
          ELTE IK Tehetség
        </a>
        <TwoFactorForm />
      </div>
    </div>
  )
}

export default SignInPage