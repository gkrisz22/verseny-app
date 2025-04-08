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

export default function ActiveCompetitions() {
    const competitions = [
        {
            id: "1",
            title: "Nemes Tihamér Országos Alkalmazói Tanulmányi Verseny",
            description:
                "Valami leírás",
            registrationDeadline: "Március 21, 2025",
            eventDate: "Április 15, 2025",
            participants: 45,
            status: "Nyitott",
            category: "Informatika",
        },
      
    ];

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
                                <Badge>{competition.category}</Badge>
                                <Badge variant="outline" className="ml-2">
                                    {competition.status}
                                </Badge>
                            </div>
                            <CardTitle className="mt-2">
                                {competition.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {competition.description}
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
                                        {competition.registrationDeadline}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground mr-1">
                                        Versenykezdés:
                                    </span>
                                    <span>{competition.eventDate}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground mr-1">
                                        Résztvevők:
                                    </span>
                                    <span>{competition.participants}</span>
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
                            <Button>Regisztráció</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
