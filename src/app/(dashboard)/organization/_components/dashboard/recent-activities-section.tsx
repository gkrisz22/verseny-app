import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const RecentActivitiesSection = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Legutóbbi tevékenységek</CardTitle>
                <CardDescription>
                    A szervezetben történt legutóbbi események
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Ma</p>
                        <div className="mt-1 space-y-2">
                            <p className="text-sm">
                                <span className="font-medium">Valaki</span>{" "}
                                regisztrált a versenyre
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Ön</span> egy új trusted user-t hozott létre.
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Tegnap
                        </p>
                        <div className="mt-1 space-y-2">
                            <p className="text-sm">
                                <span className="font-medium">
                                    Science Olympiad
                                </span>{" "}
                                registration opened
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">John Doe</span>{" "}
                                was assigned as a teacher
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default RecentActivitiesSection;
