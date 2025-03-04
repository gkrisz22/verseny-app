"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import React, { useRef } from "react";
import CardTitle from "../../_components/common/card-title";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Competition } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { SaveIcon, TriangleAlertIcon } from "lucide-react";
import { DatePicker } from "../../_components/common/date-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";

const EditCompetitionCard = ({ competition }: { competition: Competition }) => {
  const [fromDate, setFromDate] = React.useState<Date | undefined>(
    competition.startDate
  );
  const [toDate, setToDate] = React.useState<Date | undefined>(
    competition.endDate!
  );
  const [name, setName] = React.useState<string>(competition.title);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Módosítás</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="name">Név</Label>
            <Input
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="fromDate">Kezdés</Label>
            <DatePicker
              name="fromDate"
              date={fromDate}
              setDate={setFromDate}
              label="Várható kezdés dátum"
            />
            <Input
              type="hidden"
              name="fromDate"
              value={fromDate?.toISOString()}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="toDate">Befejezés</Label>
            <DatePicker
              name="toDate"
              date={toDate}
              setDate={setToDate}
              label="Várható vége dátum"
            />
            <Input type="hidden" name="toDate" value={toDate?.toISOString()} />
          </div>
        </form>

        {(competition.title !== name ||
          competition.startDate !== fromDate ||
          competition.endDate !== toDate) && (
          <Alert className="mt-6">
            <TriangleAlertIcon />
            <AlertDescription>
              A verseny adatai megváltoztak. Kérem, mentse a változtatásokat.
            </AlertDescription>
          </Alert>
        )}
        
      </CardContent>

      <CardFooter>
        {competition.title !== name || competition.startDate !== fromDate || competition.endDate !== toDate ? (
        <Button variant={"destructive"}
          onClick={() => {
            setFromDate(competition.startDate);
            setToDate(competition.endDate!);
            setName(competition.title);
          }}
        >Visszaállítás</Button>
        ) : null}
        <Button variant={"default"} className="ml-auto">
          <SaveIcon /> Mentés
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EditCompetitionCard;
