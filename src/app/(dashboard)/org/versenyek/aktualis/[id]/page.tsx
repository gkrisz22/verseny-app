import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ArrowLeft,
  Clock,
  CalendarIcon
} from "lucide-react";
import Link from "next/link";
import { getCompetitionById } from "@/app/_data/competition.data";
import { CompetitionRegistrationDialog } from "./registration-dialog";

export default async function CompetitionDetails({
  params,
}: {
  params: { id: string };
}) {
  const competitionId = (await params).id;
  const competition = await getCompetitionById(competitionId);

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
  const deadlinesData = {
    "math-olympiad-2025": {
      applicationDeadline: "2025-05-15T23:59:59",
      startDate: "2025-06-15T09:00:00",
      endDate: "2025-07-30T18:00:00",
      keyDates: [
        { name: "Registration Opens", date: "2025-03-01T09:00:00" },
        { name: "Preliminary Round", date: "2025-06-15T09:00:00" },
        { name: "Semi-Finals", date: "2025-07-01T09:00:00" },
        { name: "Finals", date: "2025-07-30T09:00:00" },
        { name: "Awards Ceremony", date: "2025-08-15T14:00:00" },
      ],
    },
    "cm98tfn7w0000t5q8cy1kn8by": {
      applicationDeadline: "2025-04-10T23:59:59",
      startDate: "2025-05-10T09:00:00",
      endDate: "2025-05-12T18:00:00",
      keyDates: [
        { name: "Registration Opens", date: "2025-02-01T09:00:00" },
        { name: "Project Proposal Due", date: "2025-03-15T23:59:59" },
        { name: "Project Setup", date: "2025-05-09T14:00:00" },
        { name: "Judging Day 1", date: "2025-05-10T09:00:00" },
        { name: "Judging Day 2", date: "2025-05-11T09:00:00" },
        { name: "Public Viewing", date: "2025-05-12T10:00:00" },
        { name: "Awards Ceremony", date: "2025-05-12T16:00:00" },
      ],
    },
  }[competition.id]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    }).format(date)
  }
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

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{competition.status}</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mt-2">
            {competition.title}
          </h1>
        </div>
        <div className="flex gap-2 self-start">
          <CompetitionRegistrationDialog competitionId={competitionId} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <DeadlineCard
          title="Jelentkezési határidő"
          date={competition.startDate.toLocaleDateString()}
          icon={<Clock className="h-5 w-5 text-muted-foreground" />}
          variant="warning"
        />
        <DeadlineCard
          title="Verseny kezdete"
          date={competition.startDate.toLocaleDateString()}
          icon={<CalendarIcon className="h-5 w-5 text-muted-foreground" />}
          variant="default"
        />
        <DeadlineCard
          title="Verseny tervezett vége"
          date={competition.endDate ? competition.endDate.toLocaleDateString() : "nincs meghatározva"}
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
                dangerouslySetInnerHTML={{ __html: competition.description }}
                className="prose dark:prose-invert max-w-none"
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

  const formattedDate = new Date(date).toLocaleDateString("hu-HU", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  /*const formattedTime = new Date(date).toLocaleTimeString("hu-HU", {
    hour: "numeric",
    minute: "numeric",
  })*/

  return (
    <div className={`rounded-lg border p-4 ${variant === "warning" ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950" : ""}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-lg font-semibold">{formattedDate}</p>
    </div>
  )
}

