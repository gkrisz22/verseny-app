import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, History, Trophy, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const StatisticsSection = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Aktív versenyek</CardTitle>
        <Trophy className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">3</div>
        <p className="text-xs text-muted-foreground">Jelenleg ennyi verseny elérhető</p>
        <Button asChild variant="ghost" className="mt-4 w-full justify-between">
          <Link href="/organization/versenyek/aktualis">
            Tekintse meg őket
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Korábbi versenyek</CardTitle>
        <History className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">12</div>
        <p className="text-xs text-muted-foreground">Verseny teljesítve</p>
        <Button asChild variant="ghost" className="mt-4 w-full justify-between">
          <Link href="/organization/versenyek/korabbi">
            Korábbi versenyek
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
        <div className="text-3xl font-bold">24</div>
        <p className="text-xs text-muted-foreground">Aktív felhasználó a szervezétben</p>
        <Button asChild variant="ghost" className="mt-4 w-full justify-between">
          <Link href="/organization/users">
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