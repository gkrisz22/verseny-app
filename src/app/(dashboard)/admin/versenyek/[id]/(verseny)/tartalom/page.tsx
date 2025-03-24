import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

const VersenyMetadataPage = () => {
  return (
    <div className='flex flex-col gap-4 p-6 border-2 rounded-lg border-secondary'>
      <h1 className='text-2xl font-bold'>Tartalom</h1>

      <form className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4'>
          <Label>Verseny neve</Label>
          <Input type='text' placeholder='Verseny neve' />
        </div>

        <div className='flex flex-col gap-4'>
          <Label>Versenyleírás</Label>
          <Textarea placeholder='Versenyleírás' rows={10} />
        </div>

        <Button type='submit' className='w-fit'>Mentés</Button>
      </form>
    </div>
  )
}

export default VersenyMetadataPage