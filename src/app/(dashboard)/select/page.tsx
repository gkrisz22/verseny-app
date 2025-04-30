
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Shield, ArrowRight } from "lucide-react"
import { getUserOrganizationData } from "@/app/_data/user.data"
import { auth } from "@/auth"
import Link from "next/link"
import { NavUser } from "../_components/sidebar/nav-user"
import SelectOrg from "./_components/select-org"
import { handleOrgRoleSelect } from "@/app/_actions/auth.action"

export default async function OrganizationsPage() {
    const session = await auth();
    const user = session?.user;
    if (!user || !user.id) {
        return <div>Nincs bejelentkezve.</div>
    }
    const userOrganizations = await getUserOrganizationData(user.id);


    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Szervezetválasztás</h1>
                        <p className="text-muted-foreground mt-1">
                            Üdvözöljük, {user.name}!
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <NavUser user={user} />
                    </div>
                </div>

                {user.superAdmin && (
                    <Card className="mb-8 border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Shield className="h-5 w-5 mr-2 text-primary" />
                                Szuper Admin hozzáférés
                            </CardTitle>
                            <CardDescription>Szuper Adminként a rendszer egészét kezelheti, felügyelheti.</CardDescription>
                        </CardHeader>

                        <CardFooter>
                            <Link href="/admin">
                                <Button className="w-full sm:w-auto">
                                    Tovább a Szuper Admin felületre
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {userOrganizations.map(({ organization, roles }) => (
                        <Card key={organization.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <CardTitle className="text-xl">{organization.name}</CardTitle>
                                        <div className="flex items-center gap-2 mt-1">
                                            {
                                                roles.map(role => (
                                                    <Badge key={role.name} variant="secondary">{role.description}</Badge>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <form action={handleOrgRoleSelect} className="flex flex-col gap-2">
                                    <input type="hidden" name="organizationId" value={organization.id} />
                                    <SelectOrg roles={roles} />
                                    <Button className="w-full" type="submit">
                                        <Building2 className="mr-2 h-4 w-4" />
                                        Kiválasztás
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {userOrganizations.length === 0 && (
                    <div className="text-center p-8">
                        <p className="text-muted-foreground">Ön nem tagja egyetlen aktív szervezetnek sem.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
