import { getCompetitionById } from '@/app/_data/competition.data';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftIcon, ArrowRightIcon, Calendar, FrownIcon, Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import OrgParticipantsDialog from './org-participants-dialog';

const VersenyReszletekPage = async ({params} : {
    params: Promise<{
        id: string
    }>
}) => {
    const id = (await params).id;
    const competition = await getCompetitionById(id);

    if(!competition) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 mt-8">
                <h1 className="text-3xl font-bold tracking-tight inline-flex items-center space-x-2"><span>Verseny nem található!</span> <FrownIcon /></h1>
                <p className="text-muted-foreground">Előfordulhat, hogy a keresett oldal egy lezárult versenyhez tartozik.</p>

                <Link href="/org/versenyek" className='mt-6'>
                    <Button variant="default">
                       <ArrowLeftIcon /> Vissza a versenyekhez
                    </Button>
                </Link>
            </div>
        )
    }


    return (
        <div className='flex flex-col space-y-6'>
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-medium tracking-tight">{competition.title} részletei</h1>
                <p className="text-muted-foreground text-sm max-w-lg">
                    Ez az oldal a verseny központja. Itt jelentkeztethet diákokat, tekintheti meg a feladatokat, valamint értékelheti a beadott megoldásokat.
                </p>
            </div>
            <Alert variant="default" className='w-fit'>
                <div className="flex items-start space-x-2">
                    <Calendar className="size-4 mt-1" />
                    <div className='flex flex-col'>
                        <span className='font-bold text-base'>Felhívás!</span>
                        <span>
                            A kategóriákra való jelentkezés szeptember 16, 23:59-ig tart.
                        </span>
                    </div>
                </div>
            </Alert>
            <div className="grid md:grid-cols-2 gap-6 lg:grid-cols-3">
                {
                    competition.categories.map((category, index) => {
                        return (
                            <Card key={index} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline">
                                            {category.name}
                                        </Badge>
                                    </div>
                                    <CardTitle className="mt-2 text-xl">
                                        {category.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="space-y-3">
                                        <div className="flex items-center text-sm">
                                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground mr-1">
                                                Jelentkezési határidő:
                                            </span>
                                            <span>
                                                {category.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground mr-1">
                                                Versenykezdés:
                                            </span>
                                            <span>{category.name}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground mr-1">
                                                Résztvevők:
                                            </span>
                                            <span>{category._count.students}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t pt-4">
                                    <Button variant="outline">
                                        Jelentkezés
                                    </Button>
                                    <Link href={`/org/versenyek/aktualis/${id}/reszletek/${category.id}`}>
                                        <Button variant="default">
                                            Fordulók <ArrowRightIcon className="ml-1 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        )
                    })
                }
                
            </div>
        </div>
    )
}

export default VersenyReszletekPage