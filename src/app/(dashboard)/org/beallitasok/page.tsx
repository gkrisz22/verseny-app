import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrgDataManagement from "./_components/org-data-management";
import OrgUserManagement from "./_components/org-user-management";
import { AlertCircle, ArrowLeft, Building, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSessionOrganizationData } from "@/lib/utilities";
import { getOrganizationData } from "@/app/_data/organization.data";
import LocalOrgSettingsMenu from "./_components/local-org-settings-tabs";

export default async function SettingsPage() {
    const orgData = await getSessionOrganizationData();

    if (orgData?.role !== "admin") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
                <AlertCircle className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold mb-2">Elérés megtagadva!</h1>
                <p className="text-muted-foreground text-center mb-6">
                    Ön nem rendelkezik a szükséges jogosultságokkal<br /> ennek az
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
    const organization = await getOrganizationData(orgData?.id || "");
    if(!organization) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
                <AlertCircle className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold mb-2">Hiba történt!</h1>
                <p className="text-muted-foreground text-center mb-6">
                    Nem található a szervezet.<br /> Kérjük, ellenőrizze a
                    szervezeti beállításokat.
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
            <LocalOrgSettingsMenu>
                <TabsContent value="profil">
                    <OrgDataManagement organization={organization} />
                </TabsContent>

                <TabsContent value="felhasznalok">
                    <OrgUserManagement />
                </TabsContent>
            </LocalOrgSettingsMenu>
        </div>
    );
}
