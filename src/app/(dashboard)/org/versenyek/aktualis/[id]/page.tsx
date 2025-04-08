import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Clock,
  ArrowLeft,
  Share2,
} from "lucide-react";
import Link from "next/link";

export default async function CompetitionDetails({
  params,
}: {
  params: { id: string };
}) {
  const competitionId = (await params).id;

  const competition = {
    id: competitionId,
    title: "Nemes Tihamér Országos Alkalmazói Tanulmányi Verseny",
    description:
      "A verseny elsődleges célja az, hogy az általános és a középiskolák tanulóinak lehetőséget adjon alkalmazói ismereteik és képességeik összehasonlítására. Egyúttal szeretnénk segítséget adni a digitális kultúra iránt érdeklődő tanulóknak és tanáraiknak az iskolai foglalkozások tematikájának összeállításához, a tehetségazonosításhoz és a tehetségfejlesztéshez.",
    registrationDeadline: "Március 21, 2025",
    eventDate: "Április 15, 2025",
    status: "Jelentkezés nyitva",
    category: "Informatika",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/organization/versenyek/aktualis">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Vissza az aktuális versenyekhez
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <Badge>{competition.category}</Badge>
            <Badge variant="outline">{competition.status}</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mt-2">
            {competition.title}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            {competition.description}
          </p>
        </div>
        <div className="flex gap-2 self-start">

          <Button>Regisztráció</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fontos információk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="text-sm font-medium">Regisztrációs határidő</p>
                <p className="text-sm text-muted-foreground">
                  {competition.registrationDeadline}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="text-sm font-medium">Versenykezdés</p>
                <p className="text-sm text-muted-foreground">
                  {competition.eventDate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Versenyleírás</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{competition.description}</p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
