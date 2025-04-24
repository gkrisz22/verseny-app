import React from 'react'
import AdatlapForm from './adatlap-form';
import { getUserById, getUserOrganizationData } from '@/app/_data/user.data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UniversityIcon, User2Icon } from 'lucide-react';
import UserOrgs from './user-orgs';

const UserAdatlapPage = async ({params}: { params: Promise<{id:string}>}) => {
    const id = (await params).id;
    const user = await getUserById(id);
    if (!user) {
        return null;
    }

    const userOrgs = await getUserOrganizationData(id);

    return (
        <div className="w-full">
            <Tabs defaultValue="alapadatok">
                <TabsList  className="grid md:grid-cols-2 w-fit">
                    <TabsTrigger value="alapadatok" className="w-full">
                        <User2Icon className='size-4 mr-1' /> Alapadatok
                    </TabsTrigger>
                    <TabsTrigger value="szervezetek" className="w-full">
                        <UniversityIcon className='size-4 mr-1' /> Szervezetek
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="alapadatok">
                    <AdatlapForm user={user.user} />
                </TabsContent>
                <TabsContent value="szervezetek">
                    <UserOrgs user={user.user} orgData={userOrgs} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default UserAdatlapPage