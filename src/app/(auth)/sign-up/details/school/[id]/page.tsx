import SignUpSchoolContact from '@/app/(auth)/_components/sign-up-school-contact';
import Icons from '@/components/icons';
import React from 'react'

const SchoolSignUpFromSkeleton = async ({ params }: {
    params: Promise<{ id: string }>
}) => {

    const { id: schoolId } = await params;
    const school = "asd";   
    if(!school) return (
        <div>Loading...</div>
    )

    return (
        <div className="w-full py-16">
        <a href="#" className="flex items-center gap-2 self-center font-medium w-fit mx-auto mb-8">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Icons.logo className="size-8" />
            </div>
            ELTE IK Tehetség
        </a>
        <SignUpSchoolContact school={school} />
        </div>
    )
}

export default SchoolSignUpFromSkeleton