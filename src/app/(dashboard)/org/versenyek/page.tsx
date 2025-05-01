import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, Calendar, FrownIcon, Users } from "lucide-react";
import Link from "next/link";
import { getCurrentCompetitions } from "@/app/_data/competition.data";
import { formatDateRange } from "@/lib/utils";
import { Competition } from "@prisma/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShowCompetitionBadge } from "../../_components/competition/show-competition-badge";

interface ExtendedCompetition extends Competition {
    categories: ({id: string, name: string})[];
    _count: {
        participants: number;
    }
};

export default async function ActiveCompetitions() {
    const competitions:ExtendedCompetition[] = await getCurrentCompetitions();
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Versenyek
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Jelenleg nyitott versenyek és adataik.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {competitions.map((competition) => (
                    <Card key={competition.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <ShowCompetitionBadge
                                    competition={competition}
                                />
                            </div>
                            <CardTitle className="mt-2 text-xl">
                                {competition.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {competition.shortDescription || ""}
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
                                        {competition.signUpStartDate &&
                                            competition.signUpEndDate &&
                                            formatDateRange(
                                                competition.signUpStartDate,
                                                competition.signUpEndDate
                                            )}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground mr-1">
                                        Verseny időpontja:
                                    </span>
                                    <span>
                                        {competition.startDate &&
                                            competition.endDate &&
                                            formatDateRange(
                                                competition.startDate,
                                                competition.endDate
                                            )}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground mr-1">
                                        Résztvevő iskolák:
                                    </span>
                                    <span>
                                        {competition._count.participants > 0
                                            ? competition._count.participants 
                                            : "még nincs"}
                                    </span>
                                </div>

                                <div className="flex items-center text-sm pt-4">
                                    <div className="flex flex-wrap gap-2">
                                        {competition.categories.map(
                                            (category: { id: string; name: string }) => (
                                                <Badge
                                                    key={category.id}
                                                    variant="outline"
                                                >
                                                    {category.name}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end border-t pt-4">
                            <Link
                                href={`/org/versenyek/${competition.id}`}
                            >
                                <Button variant="default">
                                    Részletek
                                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
                {
                    competitions.length === 0 && (
                        <div className="col-span-3">
                            <Alert className="w-fit">
                                <FrownIcon className="size-5 mr-1" />
                                <AlertTitle className="text-base font-medium">
                                    Nincs egy aktuális verseny sem.
                                </AlertTitle>
                                <AlertDescription>
                                    Jelenleg nincsenek aktív versenyek. Kérjük, nézzen vissza máskor!
                                </AlertDescription>
                            </Alert>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
