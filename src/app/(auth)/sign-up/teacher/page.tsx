import React from 'react'
import SignUpTeacherForm from '../../_components/sign-up-teacher-form'

const TeacherSignUpPage = () => {
  return (
    <div className='flex flex-col gap-6 mt-8 bg-background p-6 shadow border rounded-xl w-full max-w-lg'>
        <SignUpTeacherForm />
    </div>
  )
}

export default TeacherSignUpPage