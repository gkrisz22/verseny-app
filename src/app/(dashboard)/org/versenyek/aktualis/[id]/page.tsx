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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function CompetitionDetails({
  params,
}: {
  params: { id: string };
}) {
  const competitionId = (await params).id;
  const competition = await getCompetitionById(competitionId);

  if(!competition) {
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
          <Link href="/organization/versenyek/aktualis">
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
          <p className="text-muted-foreground mt-2 max-w-3xl">
            {competition.description}
          </p>
        </div>
        <div className="flex gap-2 self-start">

          <CompetitionRegistrationDialog />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Deadlines</CardTitle>
              <CardDescription>Important dates for this competition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <DeadlineCard
                  title="Application Deadline"
                  date={deadlinesData?.applicationDeadline}
                  icon={<Clock className="h-5 w-5 text-muted-foreground" />}
                  variant="warning"
                />
                <DeadlineCard
                  title="Competition Start"
                  date={deadlinesData?.startDate}
                  icon={<CalendarIcon className="h-5 w-5 text-muted-foreground" />}
                  variant="default"
                />
                <DeadlineCard
                  title="Competition End"
                  date={deadlinesData?.endDate}
                  icon={<CalendarIcon className="h-5 w-5 text-muted-foreground" />}
                  variant="default"
                />
              </div>
            </CardContent>
          </Card>

          </div>

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
      <Tabs defaultValue="content" className="w-full">
          <TabsList>
            <TabsTrigger value="content" asChild>
              <Link href={`/competitions/${competition.id}`}>Általános adatok</Link>
            </TabsTrigger>
            <TabsTrigger value="deadlines" asChild>
              <Link href={`/competitions/${competition.id}/deadlines`}>Határidők</Link>
            </TabsTrigger>
            <TabsTrigger value="categories" asChild>
              <Link href={`/competitions/${competition.id}/categories`}>Kategóriák</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
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

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const formattedTime = new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  })

  return (
    <div className={`rounded-lg border p-4 ${variant === "warning" ? "border-orange-200 bg-orange-50" : ""}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-lg font-semibold">{formattedDate}</p>
      <p className="text-sm text-muted-foreground">{formattedTime}</p>
    </div>
  )
}

