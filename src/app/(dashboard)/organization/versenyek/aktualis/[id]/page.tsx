import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Clock,
  ArrowLeft,
  Download,
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
    participants: 45,
    status: "Jelentkezés nyitva",
    category: "Informatika",
    location: "Iskolai környezet",
    eligibility: "Általános és középiskolások",
    organizer: "Eötvös Loránd Tudományegyetem Informatika Kar",
    rules: ["Első szabály"],
    resources: [{ name: "Teszt fájl", type: "PDF" }],
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
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Megosztás
          </Button>
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
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="text-sm font-medium">Jelentkezők</p>
                <p className="text-sm text-muted-foreground">
                  {competition.participants} regisztrált
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="text-sm font-medium">Helyszín</p>
                <p className="text-sm text-muted-foreground">
                  {competition.location}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Leírás</TabsTrigger>
              <TabsTrigger value="details">Részletek</TabsTrigger>
              <TabsTrigger value="participants">Jelentkezők</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Versenyleírás</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{competition.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="details" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Versenyrészletek</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Kategóriák</h3>
                    <p className="text-sm text-muted-foreground">
                      {competition.eligibility}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Szervező</h3>
                    <p className="text-sm text-muted-foreground">
                      {competition.organizer}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Szabályzat</h3>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1 mt-1">
                      {competition.rules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="resources" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dokumentumok</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {competition.resources.map((resource, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center">
                          <div className="mr-3 bg-muted rounded-md p-2">
                            <Download className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{resource.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {resource.type}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="participants" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Regisztrált jelentkezők
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Jelenleg {competition.participants} regisztrált jelentkező.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
