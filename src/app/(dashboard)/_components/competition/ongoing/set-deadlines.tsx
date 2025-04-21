import { Label } from "@/components/ui/label";
import React from "react";
import { DatePicker } from "../../common/date-picker";
import { Button } from "@/components/ui/button";
import { EditIcon, EyeIcon, PlayIcon, SaveIcon } from "lucide-react";
import { useActionForm } from "@/hooks/use-action-form";
import { openStage } from "@/app/_actions/stage.action";

const SetDeadlines = ({ stageId }: { stageId: string }) => {
    const [state, action, isPending] = useActionForm(openStage);
    const [accessDate, setAccessDate] = React.useState<Date | undefined>(new Date());
    const [accessEndDate, setAccessEndDate] = React.useState<Date | undefined>(new Date());
    const [evaluationDate, setEvaluationDate] = React.useState<Date | undefined>(undefined);
    const [evaluationEndDate, setEvaluationEndDate] = React.useState<Date | undefined>(undefined);
    const [reevaluationDate, setReevaluationDate] = React.useState<Date | undefined>(undefined);
    const [reevaluationEndDate, setReevaluationEndDate] = React.useState<Date | undefined>(undefined);

    React.useEffect(() => {
        if (state?.inputs?.accessDate) setAccessDate(new Date(state.inputs?.accessDate));
    }, [state?.inputs?.accessDate]);

    return (
        <form className="space-y-4" action={action}>
            <input type="hidden" name="stageId" value={stageId} />
            <div className="grid md:lg-grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                <div className="grid grid-cols-1 gap-4">
                    <Label htmlFor="accessDate" className="inline-flex items-center">
                        <EyeIcon className="mr-1 size-4" /> Hozzáférési dátum
                    </Label>
                    <DatePicker label="Hozzáférési dátum" date={accessDate} setDate={setAccessDate} />
                    <DatePicker label="Hozzáférési dátum vége" date={accessEndDate} setDate={setAccessEndDate} />
                    <small className="text-muted-foreground">A megbízott felhasználó (adminisztrátor) ekkortól eddig éri el a feladatokat.</small>
                    <input type="hidden" name="accessDate" value={accessDate?.toISOString()} />
                    <input type="hidden" name="accessEndDate" value={accessEndDate?.toISOString()} />
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <Label htmlFor="evaluationDate" className="inline-flex items-center">
                        <EditIcon className="mr-1 size-4" /> Értékelési dátum
                    </Label>
                    <DatePicker label="Értékelési dátum" date={evaluationDate} setDate={setEvaluationDate} />
                    <DatePicker label="Értékelési dátum vége" date={evaluationEndDate} setDate={setEvaluationEndDate} />
                    <small className="text-muted-foreground">A forduló értékelése ekkor kezdődik és eddig tart.</small>
                    <input type="hidden" name="evaluationDate" value={evaluationDate?.toISOString()} />
                    <input type="hidden" name="evaluationEndDate" value={evaluationEndDate?.toISOString()} />
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <Label htmlFor="reevaluationDate" className="inline-flex items-center">
                        <EditIcon className="mr-1 size-4" /> Felülértékelés dátum
                    </Label>
                    <DatePicker label="Újraértékelési dátum" date={reevaluationDate} setDate={setReevaluationDate} />
                    <DatePicker label="Újraértékelési dátum vége" date={reevaluationEndDate} setDate={setReevaluationEndDate} />
                    <small className="text-muted-foreground">A forduló újraértékelése ekkor kezdődik és eddig tart.</small>
                    <input type="hidden" name="reevaluationDate" value={reevaluationDate?.toISOString()} />
                    <input type="hidden" name="reevaluationEndDate" value={reevaluationEndDate?.toISOString()} />
                </div>
            </div>
            {isPending && <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />}
            <Button variant="default" className="mt-2">
                <SaveIcon className="h-4 w-4 mr-2" /> Mentés
            </Button>
        </form>
    );
};

export default SetDeadlines;