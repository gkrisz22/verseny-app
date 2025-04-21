import { Label } from "@/components/ui/label";
import React from "react";
import { DatePicker } from "../../common/date-picker";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useActionForm } from "@/hooks/use-action-form";
import { openStage } from "@/app/_actions/stage.action";

const ForduloStartForm = ({ stageId } : { stageId: string}) => {
    const [state, action, isPending] = useActionForm(openStage);
    const [accessDate, setAccessDate] = React.useState<Date | undefined>(
        new Date()
    );

    React.useEffect(() => {
        if (state?.inputs?.accessDate) {
            setAccessDate(new Date(state.inputs?.accessDate));
        }
    }, [state?.inputs?.accessDate]);

    return (
        <form className="space-y-4 max-w-sm" action={action}>
            <input type="hidden" name="stageId" value={stageId} />
            <div className="grid grid-cols-1 gap-4">
                <Label htmlFor="accessDate">Hozzáférési dátum</Label>
                <DatePicker
                    label="Hozzáférési dátum"
                    date={accessDate}
                    setDate={setAccessDate}
                />
                <small className="text-muted-foreground">
                    A megbízott felhasználó (adminisztrátor) ekkortól éri el a feladatokat.
                </small>
                <input
                    type="hidden"
                    name="accessDate"
                    value={new Date().toISOString()}
                />
            </div>
            <div className="items-top flex space-x-2">
                <Checkbox id="confirm" name="confirm" />
                <div className="grid gap-1.5 leading-none">
                    <Label
                        htmlFor="confirm"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Tudomásul veszem, hogy a forduló indításra kerül.
                    </Label>
                    <p className="text-sm text-muted-foreground">
                        A művelettel automatikusan átmásolódnak a diákok az előző fordulóból (vagy ha ez az első, a kategóriából).
                    </p>
                </div>
            </div>

            {
                state?.errors?.confirm && (
                    <p className="text-red-500 text-sm">
                        {state.errors.confirm}
                    </p>
                )
            }

            {
                isPending && (
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                )
            }

            <Button variant="default" className="mt-2">
                <PlayIcon className="h-4 w-4 mr-2" />
                Forduló indítása
            </Button>
        </form>
    );
};

export default ForduloStartForm;
