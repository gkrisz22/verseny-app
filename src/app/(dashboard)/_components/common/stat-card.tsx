import { Card, CardHeader } from '@/components/ui/card';
import { LucideProps } from 'lucide-react'
import React from 'react'

interface StatCardProps {
    icon: React.ElementType<LucideProps>;
    title: string;
    value: string | number;
}
const StatCard = ({icon: Icon, title, value}: StatCardProps) => {
  return (
    <Card>
        <CardHeader className='flex flex-row items-center space-x-4 text-xl'>
            {Icon && <Icon className="text-primary" />}
            <h2 className="font-semibold m-0">{title}</h2>
        </CardHeader>
        <div className="flex items-center justify-between p-6">
            <div className="flex items-center">
                <span className="text-lg font-semibold ml-4">{value}</span>
            </div>
        </div>
    </Card>
  )
}

export default StatCard