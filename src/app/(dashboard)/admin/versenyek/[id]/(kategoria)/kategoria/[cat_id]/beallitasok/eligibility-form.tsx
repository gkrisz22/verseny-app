"use client";
import CardTitle from '@/app/(dashboard)/_components/common/card-title'
import { setEligibleGrades } from '@/app/_actions/category.action';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useActionForm } from '@/hooks/use-action-form';
import React, { useEffect } from 'react'

const EligibilityForm = ({ categoryId, eligibleGrades } : { categoryId: string, eligibleGrades: number[]}) => {
    const [state, action, isPending] = useActionForm(setEligibleGrades);
    const [grades, setGrades] = React.useState<number[]>(eligibleGrades);

    const handleChange = (grade: number) => {
        console.log(grade);
        if (grades.includes(grade)) {
            setGrades(grades.filter((g) => g !== grade));
        } else {
            setGrades([...grades, grade]);
        }
    }

    useEffect(() => {
        if (state?.success) {
            setGrades(state?.inputs?.grades?.split(',').map((grade) => parseInt(grade)) || eligibleGrades);
        }
    }, [state?.success, state?.inputs?.grades, eligibleGrades])

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Jelentkező jogosultak köre
                </CardTitle>
                <CardDescription>
                    Kérem, jelölje ki azon évfolyamokat, akik jelentkezhetnek ebbe a kategóriába.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form className='w-fit' action={action}>
                    <input hidden type='text' name='categoryId' value={categoryId} readOnly />
                    <input hidden type='text' name='grades' value={grades.join(',')} readOnly />
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex flex-col space-y-2">
                            <h3 className='text-sm font-medium'>
                                Általános iskolai évfolyamok
                            </h3>
                            <div className="grid gap-4">
                                {
                                    [4, 5, 6, 7, 8].map((grade, index) => {
                                        return (
                                            <GradeBox key={index} grade={grade} onChange={handleChange} checked={grades.includes(grade)} />
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <h3 className='text-sm font-medium'>
                                Középiskolai évfolyamok
                            </h3>
                            <div className="grid gap-4">
                                {
                                    [9, 10, 11, 12, 13].map((grade, index) => {
                                        return (
                                            <GradeBox key={index} grade={grade} onChange={handleChange} checked={grades.includes(grade)} />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    {
                        state?.message &&
                        <div className='mt-8 text-red-500'>
                        </div>
                    }

                    <Button className=' mt-8' disabled={isPending} type='submit'>
                        {
                            isPending ? 'Mentés...' : 'Mentés'
                        }
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

const GradeBox = ({ grade, onChange, checked }: { grade: number, onChange: (grade: number) => void, checked: boolean}) => {
    return (
        <div className="flex items-center space-x-2">
            <Checkbox id={`grade-${grade}`} name={grade.toString()} onCheckedChange={() => onChange(grade)} checked={checked} />
            <label
                htmlFor={`grade-${grade}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {grade}. osztály
            </label>
        </div>
    );
}

export default EligibilityForm