"use client";
import { updateCompetitionMetadata } from '@/app/_actions/competition.action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionForm } from '@/hooks/use-action-form';
import { Competition } from '@prisma/client';
import React, { useState } from 'react'
import { RichTextEditor, tiptapExtensions } from '@/components/tiptap/rich-text-editor';
import { Extension, useEditor } from '@tiptap/react';
import { Textarea } from '@/components/ui/textarea';

const CompetitionContentForm = ({ competition }: { competition: Competition }) => {
    const [state, action, isPending] = useActionForm(updateCompetitionMetadata);
    const [description, setDescription] = useState<string>('');
    const editor = useEditor({
        immediatelyRender: false,
        extensions: tiptapExtensions as Extension[],
        content: competition?.description,
        editorProps: {
            attributes: {
                class: "focus:outline-none",
            },
        },
    });

    const formRef = React.useRef<HTMLFormElement>(null);
    const handleSubmit = () => {
        setDescription(editor ? editor.getHTML() : '');
        formRef.current?.requestSubmit();
    }

    return (
        <div className='flex flex-col gap-4 p-6 border-2 rounded-lg border-secondary'>
            <h1 className='text-2xl font-bold'>Tartalom</h1>

            <form action={action} className='flex flex-col gap-4'>
                <div className='flex flex-col gap-4'>
                    <Label>Verseny neve</Label>
                    <Input type='text' name="title" placeholder='Verseny neve' defaultValue={state.inputs?.title ?? competition?.title} className={state?.errors?.title ? 'border-red-500' : ''} />
                    {state?.errors?.title ? <p className='text-xs text-destructive'>{state?.errors?.title[0]}</p> : null}
                </div>

                {/*<div className='flex flex-col gap-4'>
                    <Textarea placeholder='Rövid leírás' name="short_desc" rows={10} defaultValue={state.inputs?.description ?? competition?.description} className={state?.errors?.description? 'border-red-500' : ''} />
                </div>*/}


                <div className='flex flex-col gap-4 w-full'>
                    <Label>Versenyleírás</Label>
                    <div className='overflow-hidden max-w-full box-border'>
                        <RichTextEditor editor={editor} />
                    </div>
                    {state?.errors?.description ? <p className='text-xs text-destructive'>{state?.errors?.description[0]}</p> : null}
                    <input type='hidden' name="description" value={description} />
                </div>

                <Input type='hidden' name="id" defaultValue={competition?.id} readOnly />

                <Button onClick={handleSubmit} className='w-fit' disabled={isPending}>
                    {isPending ? 'Mentés...' : 'Mentés'}
                </Button>
            </form>
        </div>
    )
}

export default CompetitionContentForm