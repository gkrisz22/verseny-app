import React from "react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryStudentTable from "./category-student-table";
import FordulokListingCards from "@/app/(dashboard)/_components/competition/fordulok-listing-cards";
import { getCategoryById } from "@/app/_data/category.data";
import { LayersIcon, UsersIcon } from "lucide-react";

const VersenyKategoriaFordulokPage = async ({
    params,
}: {
    params: Promise<{ cat_id: string }>;
}) => {
    const cat_id = (await params).cat_id;
    const category = await getCategoryById(cat_id);
    if (!category) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                        Nincs ilyen kategória
                    </h1>
                    <p className="text-muted-foreground">
                        A kért kategória nem létezik.
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                {category.name}
            </h1>
            <p className="text-muted-foreground">
                {category.eligibleGrades.join(", ")} osztályok
            </p>
            <Separator className="mb-6" />
            <Tabs defaultValue="fordulok" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="fordulok"><LayersIcon className="size-4 mr-1" /> Fordulók</TabsTrigger>
                    <TabsTrigger value="diakok"><UsersIcon className="size-4 mr-1" /> Diákok</TabsTrigger>
                </TabsList>
                <TabsContent value="fordulok">
                    <FordulokListingCards
                        category={category}
                        stages={category.stages.map((stage) => {
                            return {
                                ...stage,
                                files: stage.files.map((sf) => sf.file),
                                students: stage.students.map((s) => ({
                                    ...s,
                                    student: s.student,
                                })),
                            };
                        })}
                        isAdmin={false}
                    />
                </TabsContent>
                <TabsContent value="diakok">
                    <CategoryStudentTable
                        students={category.students}
                        categoryId={cat_id}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default VersenyKategoriaFordulokPage;
