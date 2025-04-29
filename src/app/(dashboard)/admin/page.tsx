import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';


const Dashboard = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <DashboardCard
        title="Versenyek"
        description="Hozzon létre új versenyeket, vagy kezelje a meglévőket."
        linkHref="/admin/versenyek"
        buttonText="Versenyek megtekintése"
      />
      <DashboardCard
        title="Szervezetek"
        description="Kezelje a szervezeteket és azok beállításait."
        linkHref="/admin/felhasznalok/szervezetek"
        buttonText="Szervezetek megtekintése"
      />

      <DashboardCard
        title="Felhasználók"
        description="Kezelje a felhasználókat és azok beállításait."
        linkHref="/admin/felhasznalok"
        buttonText="Felhasználók megtekintése"
      />
  
    </div>
  )
}

interface DashboardCardProps {
  title: string;
  description: string;
  linkHref: string;
  buttonText: string;
}

const DashboardCard = ({ title, description, linkHref, buttonText }: DashboardCardProps) => {
  return (
    <Card>
      <CardHeader>
        <h2 className='text-xl'>{title}</h2>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <p className='text-muted-foreground text-sm'>{description}</p>
        <Link href={linkHref}>
          <Button variant="outline" className='w-full'>
            {buttonText} <ArrowRightIcon className='h-4 w-4 ml-1' />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default Dashboard