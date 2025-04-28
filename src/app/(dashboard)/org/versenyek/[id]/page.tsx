import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ArrowLeft,
  Clock,
  CalendarIcon,
  ArrowRightIcon
} from "lucide-react";
import Link from "next/link";
import { getCompetitionById } from "@/app/_data/competition.data";
import { CompetitionRegistrationDialog } from "./registration-dialog";
import { signedUpForCompetition } from "@/app/_actions/organization.action";
import { formatDate, formatDateRange } from "@/lib/utils";
import { ShowCompetitionBadge } from "../../../_components/competition/show-competition-badge";

export default async function CompetitionDetails({
  params,
}: {
  params: Promise<{ id: string }>,
}) {
  const competitionId = (await params).id;
  const competition = await getCompetitionById(competitionId);
  const signedUp = await signedUpForCompetition(competitionId);

  if (!competition) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/org/versenyek/aktualis">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Vissza az aktuális versenyekhez
            </Link>
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight mt-2">
            Verseny nem található
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            A keresett verseny nem található.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/org/versenyek/aktualis">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Vissza az aktuális versenyekhez
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <ShowCompetitionBadge
              competition={competition}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mt-2">
            {competition.title}
          </h1>
        </div>
        <div className="flex gap-2 self-start">
          
          {!signedUp && (competition.signUpEndDate && new Date(competition.signUpEndDate) > new Date()) && ( <CompetitionRegistrationDialog competitionId={competitionId} /> )}
          {signedUp && <Link href={`/org/versenyek/${competitionId}/reszletek`}>
            <Button variant="default" >
              <span>Verseny részletei</span>
              <ArrowRightIcon />
            </Button>
          </Link>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <DeadlineCard
          title="Jelentkezési határidő"
          date={competition.signUpStartDate && competition.signUpEndDate ? formatDateRange(competition.signUpStartDate, competition.signUpEndDate) : "Nincs meghatározva."}
          icon={<Clock className="h-5 w-5 text-muted-foreground" />}
          variant="warning"
        />
        <DeadlineCard
          title="Verseny kezdete"
          date={formatDate(competition.startDate)}
          icon={<CalendarIcon className="h-5 w-5 text-muted-foreground" />}
          variant="default"
        />
        <DeadlineCard
          title="Verseny tervezett vége"
          date={competition.endDate ? formatDate(competition.endDate) : "Nincs meghatározva."}
          icon={<CalendarIcon className="h-5 w-5 text-muted-foreground" />}
          variant="default"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Versenyleírás</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                dangerouslySetInnerHTML={{ __html: competition.description || "Nincs megadva leírás." }}
                className="prose dark:prose-invert max-w-none break-words"
              />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kategóriák</CardTitle>
              <CardDescription>Az alábbi kategóriákban versenyezhetnek a diákok.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                {competition.categories.map((category) => (
                  <div key={category.id} className="flex flex-col gap-2">
                    <Badge variant="outline" className="py-2">
                      {category.name}
                    </Badge>
                    <small className="px-2">
                      {category.eligibleGrades.length > 0 ? <>{category.eligibleGrades.join(". osztály, ")}. osztály</> : "Minden osztály."}
                    </small>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}

function DeadlineCard({
  title,
  date,
  icon,
  variant = "default",
}: {
  title: string
  date?: string
  icon: React.ReactNode
  variant?: "default" | "warning"
}) {
  if (!date) return null

  return (
    <div className={`rounded-lg border p-4 ${variant === "warning" ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950" : ""}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-lg font-semibold">{date}</p>
    </div>
  )
}

