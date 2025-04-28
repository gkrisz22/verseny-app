"use client";

import CardTitle from "@/app/(dashboard)/_components/common/card-title";
import FormField from "@/app/(dashboard)/_components/common/form-field";
import { updateCompetitionSettings } from "@/app/_actions/competition.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useActionForm } from "@/hooks/use-action-form";
import { Competition } from "@prisma/client";
import { Loader2Icon, LoaderCircleIcon } from "lucide-react";
import React from "react";

const VersenyBeallitasokForm = ({ competition } : { competition: Competition}) => {
    const [state, action, isPending] = useActionForm(updateCompetitionSettings);

    return (
        <div className="grid xl:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Versenybeállítások
                    </CardTitle>
                    <CardDescription>
                        Itt állítható a verseny dátuma, jelentkezési időszaka valamint a láthatósága.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid lg:grid-cols-2 gap-4" action={action}>
                        <FormField type="date" name="competitionStartDate" id="competitionStartDate" label="Versenykezdés" defaultValue={competition.startDate || ''} errors={state.errors?.competitionStartDate} />
                        <FormField type="date" name="competitionEndDate" id="competitionEndDate" label="Verseny vége" defaultValue={competition.endDate || ''} errors={state.errors?.competitionEndDate} />
                        <FormField type="date" name="signUpStartDate" id="signUpStartDate" label="Jelentkezés kezdete" defaultValue={competition.signUpStartDate || ''} errors={state.errors?.signUpStartDate} />
                        <FormField type="date" name="signUpEndDate" id="signUpEndDate" label="Jelentkezés vége" defaultValue={competition.signUpEndDate || ''} errors={state.errors?.signUpEndDate} />
                        <FormField type="switch" name="published" id="published" label="Nyilvános" defaultValue={competition.published.toString()} placeholder="A verseny megjelenik-e az iskolák számára?" errors={state.errors?.published} colSpan={2} />
                        <input hidden type="text" name="id" value={competition.id} readOnly />
                        <div className="col-span-2 w-full">
                            {
                                (!state.success && state?.message) &&
                                <p className="text-red-500 text-sm">{state?.message}</p>
                            }
                        </div>
                        <div className="col-span-2 flex justify-end w-full">
                            <Button type="submit" className="w-fit" disabled={isPending}>
                                {
                                    isPending ? <>
                                        <Loader2Icon className="animate-spin" />
                                        <span className="ml-1">Mentés...</span>
                                    </> : "Mentés"
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default VersenyBeallitasokForm;
