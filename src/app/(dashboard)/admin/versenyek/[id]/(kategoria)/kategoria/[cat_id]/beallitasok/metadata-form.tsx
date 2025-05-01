"use client";
import CardTitle from '@/app/(dashboard)/_components/common/card-title';
import FormField from '@/app/(dashboard)/_components/common/form-field'
import { updateCategoryMetadata } from '@/app/_actions/category.action';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { useActionForm } from '@/hooks/use-action-form';
import { Category } from '@prisma/client';
import { LayersIcon } from 'lucide-react';
import React from 'react'

const KategoriaMetadataForm = ({ category }: { category: Category }) => {
    const [state, action, isLoading] = useActionForm(updateCategoryMetadata);
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Kategória adatainak módosítása
                </CardTitle>
                <CardDescription>
                    Kérem, adja meg a kategória adatait.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className='grid gap-4' action={action}>
                    <input type="hidden" name="categoryId" id="categoryId" value={category.id} />
                    <FormField
                        type="text"
                        name="name"
                        id="name"
                        label="Név"
                        placeholder="Név"
                        defaultValue={category.name}
                        Icon={LayersIcon}
                        required
                    />
                    <FormField
                        type="textarea"
                        name="description"
                        id="description"
                        label="Leírás"
                        placeholder="Leírás"
                        defaultValue={category.description}
                        Icon={LayersIcon}
                    />
                    <FormField
                        type="switch"
                        name="published"
                        id="published"
                        label="Nyilvános"
                        placeholder="Legyen-e listázva a kategória az oldalon?"
                        defaultValue={category.published}
                    />

                    <Button type="submit" className='w-fit' disabled={isLoading}>
                        Mentés
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default KategoriaMetadataForm