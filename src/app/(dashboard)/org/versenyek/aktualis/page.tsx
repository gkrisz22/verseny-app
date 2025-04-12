import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users } from "lucide-react";
import Link from "next/link";
import { getCurrentCompetitions } from "@/app/_data/competition.data";
import { CompetitionRegistrationDialog } from "./[id]/registration-dialog";

export default async function ActiveCompetitions() {
    const competitions = await getCurrentCompetitions();
    console.log(competitions[0]);
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Aktuális versenyek
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Jelenleg nyitott versenyek és adataik.
                    </p>
                </div>
                <Button variant={"outline"}>Korábbi versenyeink</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {competitions.map((competition) => (
                    <Card key={competition.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <Badge variant="outline">
                                    {competition.status}
                                </Badge>
                            </div>
                            <CardTitle className="mt-2 text-xl">
                                {competition.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {(() => {
                                    if (competition.description.length > 160) {
                                        const lastPeriod = competition.description.lastIndexOf('.', 160);
                                        return lastPeriod > 0 
                                            ? competition.description.slice(0, lastPeriod + 1)
                                            : `${competition.description.slice(0, 160)}...`;
                                    }
                                    return competition.description;
                                })()}
                            </p>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-3">
                                <div className="flex items-center text-sm">
                                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground mr-1">
                                        Jelentkezési határidő:
                                    </span>
                                    <span>
                                        {competition.startDate.toDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground mr-1">
                                        Versenykezdés:
                                    </span>
                                    <span>{competition.startDate.toDateString()}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground mr-1">
                                        Résztvevők:
                                    </span>
                                    <span>{competition.participants.length > 0 ? competition.participants.length : "még nincs"}</span>

                                </div>

                                <div className="flex items-center text-sm pt-4">
                                    <div className="flex flex-wrap gap-2">
                                        {competition.categories.map((category) => (
                                            <Badge key={category.id} variant="outline">
                                                {category.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                            <Button variant="outline" asChild>
                                <Link
                                    href={`/org/versenyek/aktualis/${competition.id}`}
                                >
                                    Részletek
                                </Link>
                            </Button>
                            <CompetitionRegistrationDialog competitionId={competition.id} />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
