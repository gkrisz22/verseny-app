import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpIcon } from 'lucide-react';
import React, { useActionState } from 'react'


const initialState = {
  success: false,
  message: '',
};
const TaskUploader = () => {
  const [state, action, isPending] = useActionState(taskinitialState);

  return (
    <div className='flex flex-col space-y-6'>
      <Label className='text-lg font-semibold'>Feladat feltöltése</Label>
      <Input
        type='file'
        className='border border-gray-300 rounded-md p-2'
        accept='.pdf,.zip,.doc,.docx'
      />
      <Button className='bg-blue-500 text-white rounded-md p-2'>
        <FileUpIcon /> Feltöltés
      </Button>
    </div>
  )
}

export default TaskUploader
