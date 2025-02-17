import { ToggleTheme } from '@/components/ui/theme-toggler'
import React from 'react'

const SignUpPage = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
        <ToggleTheme />
    </div>
  )
}

export default SignUpPage