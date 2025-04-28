"use client";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React from 'react'
import { DatePicker } from './date-picker';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from '@/lib/utils';

export interface IFormField {
    type: string;
    name: string;
    id: string;
    label: string;
    placeholder?: string;
    colSpan?: number;
    Icon?: React.ElementType;
    errors?: string[];
    defaultValue?: Date | string | number | boolean;
    required?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    rows?: number;
    min?: number;
    max?: number;
    options?: { value: string; label: string }[]; // Add options for select type
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
    const [checked, setChecked] = React.useState<boolean | undefined>(field.defaultValue as boolean);
    const [date, setDate] = React.useState<Date | undefined>(field.defaultValue ? new Date(field.defaultValue as string) : undefined);
    const [checkboxChecked, setCheckboxChecked] = React.useState<boolean | "indeterminate" | undefined>(field.defaultValue as boolean);
    const [selected, setSelected] = React.useState<string | undefined>(field.defaultValue as string);

    React.useEffect(() => {
        if (field.defaultValue as boolean) {
            setChecked(true);
            setCheckboxChecked(true);
        }
    }, [field.defaultValue]);

    const errorClass = field.errors && field.errors.length > 0 ? "border-red-500" : "";

    switch (field.type) {
        case "number":
            return <Input type="number" disabled={field.disabled || false} readOnly={field.readOnly || false} name={field.name} id={field.id} placeholder={field.placeholder} defaultValue={Number(field.defaultValue)} className={cn(errorClass, `peer ${field.Icon ? "pl-8" : ""}`)} min={field.min} max={field.max} />;
        case "text":
            return <Input disabled={field.disabled || false} readOnly={field.readOnly || false} name={field.name} id={field.id} placeholder={field.placeholder} defaultValue={field.defaultValue?.toString()} className={cn(errorClass, `peer ${field.Icon ? "pl-8" : ""}`)} />;
        case "email":
            return <Input type="email" disabled={field.disabled || false} readOnly={field.readOnly || false} name={field.name} id={field.id} placeholder={field.placeholder} defaultValue={field.defaultValue?.toString()} className={cn(errorClass, `peer ${field.Icon ? "pl-8" : ""}`)}/>;
        case "textarea":
            return <Textarea disabled={field.disabled || false} readOnly={field.readOnly || false} name={field.name} id={field.id} placeholder={field.placeholder} defaultValue={field.defaultValue?.toString()} className={cn(errorClass, `peer ${field.Icon ? "pl-8" : ""}`)} rows={field.rows || 2} />;
        case "date": 
            return <>
                <DatePicker date={date} setDate={setDate} label={field.label} />
                <input type="hidden" name={field.name} id={field.id} value={date?.toISOString() || ''} />
            </>;

        case "switch":
            return <div className='flex items-center gap-2'>
                <Switch disabled={field.disabled || false} checked={checked} onCheckedChange={setChecked} id={field.id} />
                <Label htmlFor={field.id} className={`font-normal ${errorClass ? "text-red-500" : ""}`}>{field.placeholder}</Label>
                <input type="hidden" name={field.name} value={checked ? "true" : "false"} />
            </div>;

        case "checkbox":
            return <div className='flex items-center gap-2'>
                <Checkbox 
                    disabled={field.disabled || false}  
                    checked={checkboxChecked}
                    onCheckedChange={setCheckboxChecked}
                    id={field.id}
                />
                <Label htmlFor={field.id} className={`font-normal ${errorClass ? "text-red-500" : ""}`}>{field.label}</Label>
                <input type="hidden" name={field.name} value={checkboxChecked ? "true" : "false"} />
            </div>;

        case "select":
            return (
                <div>
                    <Select onValueChange={setSelected} value={selected}>
                        <SelectTrigger className={`w-full ${errorClass}`}>
                            <SelectValue placeholder={field.placeholder || "Válasszon"} />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input type="hidden" name={field.name} id={field.id} value={selected || ""} />
                </div>
            );

        default:
            return <p>Nem implementált mező típus: {field.type}</p>;
    }
}
export default FormField