import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const BackToRegButton = () => {
  return (
    <Link href="/sign-up" passHref className="w-full">
      <Button
        variant={"link"}
        className="w-full text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon size={24} /> Másik szerepkörrel szeretnék regisztrálni
      </Button>
    </Link>
  );
}

export default BackToRegButton