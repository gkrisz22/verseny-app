"use client";

import CardTitle from "@/app/(dashboard)/_components/common/card-title";
import { DatePicker } from "@/app/(dashboard)/_components/common/date-picker";
import { updateCompetitionDates, updateCompetitionSignUpDates } from "@/app/_actions/competition.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useActionForm } from "@/hooks/use-action-form";
import { Competition } from "@prisma/client";
import React from "react";

const HataridoForm = ({ competition } : { competition: Competition}) => {
    const [signUpStartDate, setSignUpStartDate] = React.useState<Date | undefined>(competition.signUpStartDate || undefined);
    const [signUpEndDate, setSignUpEndDate] = React.useState<Date | undefined>(competition.signUpEndDate || undefined);
    const [competitionStartDate, setCompetitionStartDate] = React.useState<Date | undefined>(competition.startDate || undefined);
    const [competitionEndDate, setCompetitionEndDate] = React.useState<Date | undefined>(competition.endDate || undefined);

    const [compState, compAction, compIsPending] = useActionForm(updateCompetitionDates);
    const [signUpState, signUpAction, signUpIsPending] = useActionForm(updateCompetitionSignUpDates);

    React.useEffect(() => {
        if (signUpState) {
            console.log(signUpState.message);
            console.log(signUpState.success);
            console.log(signUpState.errors?.signUpEndDate?.length);
        }
    }, [signUpState]);

    return (
        <div className="grid md:grid-cols-2 gap-6">

            <Card>
                <CardHeader>
                    <CardTitle>
                        Verseny időpontja
                    </CardTitle>
                    <CardDescription>
                        Itt állíthatja be a verseny időpontját.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" action={compAction}>
                        <input hidden type="text" name="id" value={competition.id} readOnly />
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="competitionStartDate" className="text-gray-600">
                                Kezdete
                            </Label>
                            <DatePicker
                                date={competitionStartDate}
                                setDate={setCompetitionStartDate}
                                label="Kezdés dátuma"
                            />
                            <input hidden type="text" name="competitionStartDate" value={competitionStartDate?.toISOString() || ''} readOnly />
                            {
                               compState?.errors?.competitionStartDate &&
                                <p className="text-red-500 text-sm">{compState?.errors?.competitionStartDate[0]}</p>
                            }
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="competitionEndDate" className="text-gray-600">
                                Vége
                            </Label>
                            <DatePicker
                                date={competitionEndDate}
                                setDate={setCompetitionEndDate}
                                label="Vége dátuma"
                            />
                            {
                              compState?.errors?.competitionEndDate &&
                                <p className="text-red-500 text-sm">{compState?.errors?.competitionEndDate[0]}</p>
                            }
                            <input hidden type="text" name="competitionEndDate" value={competitionEndDate?.toISOString() || ''} readOnly />
                        </div>
                        <div className="col-span-2 w-full">
                            {
                                (!compState.success && compState?.message) &&
                                <p className="text-red-500 text-sm">{compState?.message}</p>
                            }
                        </div>
                        <div className="col-span-2 flex justify-end w-full">
                            <Button type="submit" className="w-fit" disabled={compIsPending || signUpIsPending}>
                                Mentés
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Jelentkezési határidő
                    </CardTitle>
                    <CardDescription>
                        Itt állíthatja be a jelentkezési időszakot.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" action={signUpAction}>
                        <input hidden type="text" name="id" value={competition.id} readOnly />
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="signUpStartDate" className="text-gray-600">
                                Kezdete
                            </Label>
                            <DatePicker
                                date={signUpStartDate}
                                setDate={setSignUpStartDate}
                                label="Kezdés dátuma"
                            />
                            <input hidden type="text" name="signUpStartDate" value={signUpStartDate?.toISOString() || ''} readOnly />
                            {
                             signUpState?.errors?.signUpStartDate &&
                                <p className="text-red-500 text-sm">{signUpState?.errors?.signUpStartDate[0]}</p>
                            }
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="signUpEndDate" className="text-gray-600">
                                Vége
                            </Label>
                            <DatePicker
                                date={signUpEndDate}
                                setDate={setSignUpEndDate}
                                label="Vége dátuma"
                            />
                            <input hidden type="text" name="signUpEndDate" value={signUpEndDate?.toISOString() || ''} readOnly />
                            {
                            signUpState?.errors?.signUpEndDate &&
                                <p className="text-red-500 text-sm">{signUpState?.errors?.signUpEndDate[0]}</p>
                            }
                        </div>
                        <div className="col-span-2 w-full">
                            {
                                (!signUpState.success && signUpState?.message) &&
                                <p className="text-red-500 text-sm">{signUpState?.message}</p>
                            }
                        </div>
                        <div className="col-span-2 flex justify-end w-full">
                            <Button type="submit" className="w-fit" disabled={compIsPending || signUpIsPending}>
                                Mentés
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

        </div>
    );
};

export default HataridoForm;
