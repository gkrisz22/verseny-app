import { DataTable } from "@/app/(dashboard)/_components/common/data-table";
import { getAcademicYears } from "@/app/_data/settings.data";
import React from "react";
import { columns } from "./columns";
import { ManageTanevDialog } from "./manage-tanev-dialog";
import { Button } from "@/components/ui/button";

const TanevSettingsPage = async () => {
    const academicYears = await getAcademicYears();

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="space-y-0.5">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    Tanévek
                </h1>
                <p className="text-muted-foreground">
                    Új tanév létrehozása és meglévő tanévek kezelése itt
                    történik.
                </p>
            </div>
            <DataTable
                data={academicYears}
                columns={columns}
                searchParams={{
                    column: "name",
                    placeholder: "Keresés tanév név alapján",
                }}
                addButton={
                    <ManageTanevDialog>
                        <Button variant="outline" className="w-full">
                            Új tanév létrehozása
                        </Button>
                    </ManageTanevDialog>
                }
            />
        </div>
    );
};

export default TanevSettingsPage;
