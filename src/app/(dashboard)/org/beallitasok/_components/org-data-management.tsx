"use client";
import React from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FormField, { IFormField } from "@/app/(dashboard)/_components/common/form-field";
import { useActionForm } from "@/hooks/use-action-form";
import { updateOrganizationData } from "@/app/_actions/organization.action";
import { toast } from "sonner";
import { Organization } from "@prisma/client";
import regions from "@/lib/regions.json";


const formFields:IFormField[] = [
    {
        type: "text",
        name: "name",
        id: "name",
        label: "Szervezet neve",
        placeholder: "Eötvös Loránd Tudományegyetem Informatikai Kar",
        colSpan: 2,
        required: true,
    },
    {
        type: "text",
        name: "contactName",
        id: "contactName",
        label: "Kapcsolattartó neve",
        placeholder: "Teszt Igazgatóhelyettes",
        colSpan: 1,
        required: true,
    },
    {
        type: "text",
        name: "contactEmail",
        id: "contactEmail",
        label: "Kapcsolati e-mail cím",
        placeholder: "kapcsolat@inf.elte.hu",
        colSpan: 1,
        required: true,
    },
    {
        type: "text",
        name: "phoneNumber",
        id: "phoneNumber",
        label: "Telefonszám",
        placeholder: "+36 1 234 5678",
        colSpan: 1,
        required: true,
    },
    {
        type: "text",
        name: "website",
        id: "website",
        label: "Weboldal",
        placeholder: "https://www.inf.elte.hu/",
        colSpan: 1,
    },
    {
        type: "text",
        name: "postalCode",
        id: "postalCode",
        label: "Irányítószám",
        placeholder: "1027",
        colSpan: 1,
        required: true,
    },
    {
        type: "select",
        name: "region",
        id: "region",
        label: "Régió/Vármegye",
        placeholder: "Régió/vármegye",
        colSpan: 1,
        required: true,
        options: regions.regions.map((r) => ({
            label: r.name,
            value: r.id,
        })).concat(
            regions.counties.map((r) => ({
                label: r.name,
                value: r.id,
            }))
        ),
    },
    {
        type: "text",
        name: "city",
        id: "city",
        label: "Város",
        placeholder: "Város",
        colSpan: 1,
        required: true,
    },
    {
        type: "text",
        name: "address",
        id: "address",
        label: "Cím",
        placeholder: "Pázmány Péter sétány 1/A",
        colSpan: 1,
        required: true,
    },
];


const OrgDataManagement = ({ organization}: {organization:Organization} ) => {
    const [state, action, isPending] = useActionForm(updateOrganizationData);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Szervezeti adatok</CardTitle>
                <CardDescription>
                    Itt módosíthatja szervezete nevét, leírását és egyéb adatait.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid gap-4 md:grid-cols-2" action={action}>
                    {formFields.map(field => (
                        <FormField
                            key={field.id}
                            type={field.type}
                            name={field.name}
                            id={field.id}
                            label={field.label}
                            placeholder={field.placeholder}
                            colSpan={field.colSpan}
                            Icon={field.Icon}
                            errors={state.errors?.[field.name as keyof typeof state.errors] || []}
                            required={field.required}
                            defaultValue={state.inputs?.[field.name as keyof typeof state.inputs] || organization[field.name as keyof Organization] || ""}
                            options={field.options}
                            />
                        )
                    )}
                    
                    <div className="col-span-2 flex justify-end">
                        <Button type="submit" variant="default" disabled={isPending} className="w-fit">
                            <Save className="mr-2 h-4 w-4" />
                            Mentés
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default OrgDataManagement;