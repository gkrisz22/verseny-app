import { Badge } from "@/components/ui/badge";
import { dateDiffInDays } from "@/lib/utils";
import { Competition } from "@prisma/client";
import { CalendarIcon, SettingsIcon } from "lucide-react";

export function ShowCompetitionBadge({ competition }: { competition: Competition }) {
    if (
        competition.signUpEndDate &&
        new Date(competition.signUpEndDate) > new Date()
    ) {
        const daysLeft = dateDiffInDays(new Date(), competition.signUpEndDate);
        return <Badge variant="secondary" className="w-fit"><CalendarIcon className="size-4 mr-1" /> {daysLeft} napig lehet jelentkezni még.</Badge>;
    }
    if (
        competition.signUpEndDate &&
        new Date(competition.signUpEndDate) < new Date()
    ) {
        return (
            <Badge variant="destructive" className="w-fit">
                <CalendarIcon className="size-4 mr-1" />
                Lezárult a jelentkezés.
            </Badge>
        );
    }

    return <Badge variant="outline" className="w-fit"><SettingsIcon className="size-4 mr-1" /> Beállítás alatt.</Badge>;
}
