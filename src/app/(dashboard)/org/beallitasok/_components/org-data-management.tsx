"use client";
import React from "react";
import {
    Mail,
    Phone,
    Globe,
    MapPin,
    Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";


interface FormField {
    type: string;
    name: string;
    id: string;
    label: string;
    placeholder: string;
    colSpan: number;
    icon?: React.ElementType;
}

const formFields:FormField[] = [
    {
        type: "input",
        name: "name",
        id: "name",
        label: "Szervezet neve",
        placeholder: "Eötvös Loránd Tudományegyetem Informatikai Kar",
        colSpan: 2,
    },
    {
        type: "input",
        icon: Mail,
        name: "email",
        id: "email",
        label: "Kapcsolati e-mail cím",
        placeholder: "kapcsolat@inf.elte.hu",
        colSpan: 1,
    },
    {
        type: "input",
        icon: Phone,
        name: "phone",
        id: "phone",
        label: "Telefonszám",
        placeholder: "+36 1 234 5678",
        colSpan: 1,
    },
    {
        type: "input",
        icon: Globe,
        name: "website",
        id: "website",
        label: "Weboldal",
        placeholder: "https://www.inf.elte.hu",
        colSpan: 2,
    },
    {
        type: "textarea",
        name: "description",
        id: "description",
        label: "Leírás",
        placeholder: "Opcionális leírás a szervezetről",
        colSpan: 2,
    },
    {
        type: "input",
        name: "zipCode",
        id: "zipCode",
        label: "Irányítószám",
        placeholder: "1027",
        colSpan: 1,
    },
    {
        type: "input",
        name: "state",
        id: "state",
        label: "Régió/Vármegye",
        placeholder: "State",
        colSpan: 1,
    },
    {
        type: "input",
        name: "city",
        id: "city",
        label: "Város",
        placeholder: "City",
        colSpan: 1,
    },
    {
        type: "input",
        icon: MapPin,
        name: "address",
        id: "address",
        label: "Cím",
        placeholder: "Pázmány Péter sétány 1/A",
        colSpan: 1,
    },
];


const OrgDataManagement = () => {
    
    const renderField = (field: FormField) => {
        const Icon = field.icon;
        return (
            <div key={field.id} className={`col-span-${field.colSpan}`}>
                <Label className="block text-sm font-medium">{field.label}</Label>
                <div className="relative">
                    {Icon && <Icon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />}
                    {field.type === "input" && (
                        <Input
                            name={field.name}
                            id={field.id}
                            placeholder={field.placeholder}
                            className={Icon ? "pl-8" : ""}
                        />
                    )}
                    {field.type === "textarea" && (
                        <Textarea
                            name={field.name}
                            id={field.id}
                            placeholder={field.placeholder}
                            className="min-h-[100px]"
                        />
                    )}
                </div>
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Szervezeti adatok</CardTitle>
                <CardDescription>
                    Itt módosíthatja szervezete nevét, leírását és egyéb adatait.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid gap-4 md:grid-cols-2">
                    {formFields.map(renderField)}
                    <div className="col-span-2 flex justify-end">
                        <Button type="submit">
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