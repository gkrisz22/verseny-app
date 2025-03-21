import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TodoSection = () => {
    const todoItems = {
        admin: [
            {
                id: "1",
                title: "Review user registration requests",
                priority: "magas",
                dueDate: "Today",
                link: "/organization/users",
            },
            {
                id: "2",
                title: "Approve Math Challenge 2025 competition details",
                priority: "közepes",
                dueDate: "Mar 18, 2025",
                link: "/organization/competitions/active/1",
            },
            {
                id: "3",
                title: "Update organization profile information",
                priority: "alacsony",
                dueDate: "Mar 25, 2025",
                link: "/organization/settings",
            },
        ],
        teacher: [
            {
                id: "1",
                title: "Alkalmazói verseny értékelése",
                priority: "magas",
                dueDate: "Ma",
                link: "/organization/competitions/active/2/evaluate",
            },
            {
                id: "2",
                title: "Jelentkezés a Nemes Tihamér versenyre",
                priority: "alacsony",
                dueDate: "Mar 20, 2025",
                link: "/organization/competitions/active/1/problems",
            }
        ],
        contact: [
        ],
        trusted: [
        ]
    };

    const currentRole = "teacher";
    const currentTodos = todoItems["teacher"] || [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Az Ön teendői a jelenlegi szervezetében</CardTitle>
                <CardDescription>
                    Az alábbi teendők vannak a listában, amelyeket el kell végeznie, mint {currentRole}.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {currentTodos.length > 0 ? (
                    <div className="space-y-4">
                        {currentTodos.map((todo) => (
                            <div
                                key={todo.id}
                                className="flex items-start gap-4 p-3 rounded-lg border"
                            >
                                <div
                                    className={cn(
                                        "rounded-full p-1",
                                        todo.priority === "magas"
                                            ? "bg-destructive/20 text-destructive"
                                            : todo.priority === "közepes"
                                            ? "bg-amber-500/20 text-amber-500"
                                            : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {todo.priority === "magas" ? (
                                        <AlertCircle className="h-5 w-5" />
                                    ) : todo.priority === "közepes" ? (
                                        <Clock className="h-5 w-5" />
                                    ) : (
                                        <CheckCircle2 className="h-5 w-5" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col space-y-1">
                                            <h4 className="font-medium">
                                                {todo.title}
                                            </h4>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Határidő: {todo.dueDate}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge
                                                variant={
                                                    todo.priority === "magas"
                                                        ? "destructive"
                                                        : todo.priority ===
                                                          "közepes"
                                                        ? "default"
                                                        : "outline"
                                                }
                                            >
                                                {todo.priority}
                                            </Badge>
                                            <Button asChild size="sm">
                                                <Link href={todo.link}>
                                                    Tovább
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="font-medium text-lg">Minden naprakész!</h3>
                        <p className="text-muted-foreground mt-1">
                            Jelenleg nincs teendő a listában.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TodoSection;
