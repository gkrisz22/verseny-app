import { getCurrentCompetitions } from '@/app/_data/competition.data'
import { getOrganizationUsers } from '@/app/_data/organization.data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, History, Trophy, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const StatisticsSection = async () => {
  const competitions = await getCurrentCompetitions();
  const organizationUsers = await getOrganizationUsers();
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Aktív versenyek</CardTitle>
        <Trophy className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{competitions.length}</div>
        <p className="text-xs text-muted-foreground">Jelenleg ennyi verseny elérhető</p>
        <Button asChild variant="ghost" className="mt-4 w-full justify-between">
          <Link href="/org/versenyek/">
            Tekintse meg őket
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Szervezeti felhasználók</CardTitle>
        <Users className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{organizationUsers.length}</div>
        <p className="text-xs text-muted-foreground">Aktív felhasználó a szervezétben</p>
        <Button asChild variant="ghost" className="mt-4 w-full justify-between">
          <Link href="/org/users">
            Felhasználók kezelése
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  </div>
  )
}

export default StatisticsSection