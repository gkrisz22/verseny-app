import { DataTable } from "@/app/(dashboard)/_components/common/data-table";
import { columns } from "./columns";
import InviteUserDialog from "./invite-user-dialog";
import { getOrganizationUsers } from "@/app/_data/organization.data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OrgUserManagement() {
    const users = await getOrganizationUsers();

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between w-full">
                <div className="flex flex-col w-fit">
                <CardTitle>Felhasználók</CardTitle>
                <CardDescription>
                    A szervezet tagjainak kezelése, szerepkörök módosítása.
                </CardDescription>
                </div>
                <InviteUserDialog  />

            </CardHeader>
            <div className="flex justify-end">
            </div>
            <CardContent>
            <DataTable
                data={users.map((u) => ({
                    ...u.user,
                    roles: u.roles.map((r) => r.role.name),
                }))}
                columns={columns}
                searchParams={{
                    column: "name",
                    placeholder: "Keresés név alapján",
                }}
            />
            </CardContent>
        </Card>
    );
}
