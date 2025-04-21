import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrgDataManagement from "./_components/org-data-management";
import OrgUserManagement from "./_components/org-user-management";
import { AlertCircle, ArrowLeft, Building, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    // Mock organization data - in a real app, this would come from an API
    const organizationData = {
        name: "Acme Education",
        description:
            "A leading educational organization focused on promoting STEM education through competitions and workshops for students of all ages.",
        email: "contact@acmeeducation.org",
        phone: "(555) 123-4567",
        website: "https://www.acmeeducation.org",
        address: "123 Learning Lane",
        city: "Knowledge City",
        state: "Education State",
        zipCode: "12345",
        country: "United States",
        organizationType: "educational",
        logo: "/placeholder.svg?height=100&width=100",
    };

    if (organizationData.organizationType !== "educational") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
                <AlertCircle className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold mb-2">Elérés megtagadva!</h1>
                <p className="text-muted-foreground text-center mb-6">
                    Ön nem rendelkezik a szükséges jogosultságokkal ennek az
                    oldalnak a megtekintéséhez.
                </p>
                <Link href="/org">
                    <Button variant={"link"} size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Vissza a főoldalra
                    </Button>
                </Link>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Szervezeti beállítások
                </h1>
                <p className="text-muted-foreground mt-2">
                    Itt kezelheti szervezete adatait, értesítési beállításait.
                </p>
            </div>
            <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-2 max-w-sm">
                    <TabsTrigger value="profile">
                        <Building className="mr-2 h-4 w-4" />
                        Szervezeti profil
                    </TabsTrigger>
                    <TabsTrigger value="users">
                        <Users className="mr-2 h-4 w-4" />
                        Felhasználók
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <OrgDataManagement />
                </TabsContent>

                <TabsContent value="users">
                    <OrgUserManagement />
                </TabsContent>
            </Tabs>
        </div>
    );
}
