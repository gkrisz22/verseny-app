"use client";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React from 'react'
import { DatePicker } from './date-picker';
import { Switch } from '@/components/ui/switch';

interface IFormField {
    type: string;
    name: string;
    id: string;
    label: string;
    placeholder?: string;
    colSpan?: number;
    Icon?: React.ElementType;
    errors?: string[];
    defaultValue?: Date | string;
    required?: boolean;
}

const FormField: React.FC<IFormField> = (
    field
) => {
    return (
        <div className={`col-span-${field.colSpan || 12}`}>
            {field.type !== "checkbox" &&
            <Label className="block text-sm font-medium mb-1">{field.label} {field.required? "*" : ""}</Label>
            }
            <div className="relative">
                <RenderField field={field} />
                {field.Icon && (
                    <field.Icon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground peer-focus:text-foreground duration-300" />
                )}

                {field.errors && field.errors.length > 0 && (
                    <div className="flex flex-col gap-2 text-red-500 text-sm pl-2 mt-2">
                        {field.errors.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const RenderField = ({ field }: { field: IFormField }) => {
    const [checked, setChecked] = React.useState<boolean | undefined>(field.defaultValue === "true");
    const [date, setDate] = React.useState<Date | undefined>(field.defaultValue ? new Date(field.defaultValue) : undefined);

    switch (field.type) {
        case "text":
            return <Input name={field.name} id={field.id} placeholder={field.placeholder} defaultValue={field.defaultValue?.toString()} className={`peer ${field.Icon ? "pl-8" : ""}`} />;
        case "textarea":
            return <Textarea name={field.name} id={field.id} placeholder={field.placeholder} defaultValue={field.defaultValue?.toString()} className={`peer ${field.Icon ? "pl-8" : ""}`} />;
        case "date": 
            return <>
                <DatePicker date={date} setDate={setDate} label={field.label} />
                <input type="hidden" name={field.name} id={field.id} value={date?.toISOString() || ''} />
            </>

        case "switch":
            return <div className='flex items-center gap-2'>
                <Switch checked={checked} onCheckedChange={setChecked} id={field.id} />
                <Label htmlFor={field.id} className='font-normal'>{field.placeholder}</Label>
                <input type="hidden" name={field.name} id={field.id} value={checked? "true" : "false"} />
            </div>
        default:
            return <p>Nem implementált mező típus: {field.type}</p>;
    }
}
export default FormField