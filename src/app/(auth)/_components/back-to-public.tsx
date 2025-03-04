import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const BackToPublicPageLink = () => {
  return (
    <Link href="/" passHref className='w-fit'>
        <Button variant="link">Vissza</Button>
    </Link>
  )
}

export default BackToPublicPageLink