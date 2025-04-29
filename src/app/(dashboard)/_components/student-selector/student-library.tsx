"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { StudentUploadForm } from "./student-upload-form";
import { getStudents, deleteStudent } from "@/app/_actions/student.action";
import { toast } from "sonner";
import { format } from "date-fns";
import { MoreHorizontal, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { Student } from "@prisma/client";

interface StudentLibraryProps {
    onSelect?: (student: Student) => void;
    onSelectMultiple?: (students: Student[]) => void;
    selectedStudents?: Student[];
    multipleSelection?: boolean;
    exclude?: string[];
}

export function StudentLibrary({
    onSelect,
    onSelectMultiple,
    selectedStudents = [],
    multipleSelection = false,
    exclude = [],
}: StudentLibraryProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(
        null
    );
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(
        new Set(selectedStudents.map((s) => s.id))
    );

    const loadStudents = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getStudents();
            if (exclude.length > 0) {
                console.log(
                    "Filtered data: ",
                    data.filter((student) => !exclude.includes(student.id))
                );
                setStudents(
                    data.filter((student) => !exclude.includes(student.id))
                );
                setFilteredStudents(
                    data.filter((student) => !exclude.includes(student.id))
                );
            } else {
                setStudents(data);
                setFilteredStudents(data);
            }
        } catch (error) {
            toast("Hiba", {
                description: "Failed to load students. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }, [exclude]);

    useEffect(() => {
        loadStudents();
    }, [loadStudents]);

    useEffect(() => {
        setSelectedIds(new Set(selectedStudents.map((s) => s.id)));
    }, [selectedStudents]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredStudents(students);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredStudents(
                students.filter(
                    (student) =>
                        student.name.toLowerCase().includes(query) ||
                        student.uniqueId.toLowerCase().includes(query)
                )
            );
        }
    }, [searchQuery, students]);

    async function handleDeleteStudent() {
        if (!studentToDelete) return;

        setIsDeleting(true);
        try {
            await deleteStudent(studentToDelete.id);
            setStudents(students.filter((s) => s.id !== studentToDelete.id));

            if (selectedIds.has(studentToDelete.id)) {
                const newSelectedIds = new Set(selectedIds);
                newSelectedIds.delete(studentToDelete.id);
                setSelectedIds(newSelectedIds);
                updateSelectedStudents(newSelectedIds);
            }

            toast("Student deleted", {
                description: `${studentToDelete.name} has been deleted successfully.`,
            });
        } catch (error) {
            toast.error("Hiba", {
                description: "Failed to delete student. Please try again.",
            });
        } finally {
            setIsDeleting(false);
            setStudentToDelete(null);
        }
    }

    function handleEditSuccess() {
        setEditingStudent(null);
        loadStudents();
    }

    function toggleSelectStudent(student: Student) {
        const newSelectedIds = new Set(selectedIds);

        if (newSelectedIds.has(student.id)) {
            newSelectedIds.delete(student.id);
        } else {
            newSelectedIds.add(student.id);
        }

        setSelectedIds(newSelectedIds);
        updateSelectedStudents(newSelectedIds);
    }

    function toggleSelectAll() {
        if (selectedIds.size === filteredStudents.length) {
            setSelectedIds(new Set());
            updateSelectedStudents(new Set());
        } else {
            const newSelectedIds = new Set(filteredStudents.map((s) => s.id));
            setSelectedIds(newSelectedIds);
            updateSelectedStudents(newSelectedIds);
        }
    }

    function updateSelectedStudents(selectedIds: Set<string>) {
        if (onSelectMultiple) {
            const selectedStudentsList = students.filter((s) =>
                selectedIds.has(s.id)
            );
            onSelectMultiple(selectedStudentsList);
        }
    }

    function handleRowClick(student: Student) {
        if (multipleSelection) {
            toggleSelectStudent(student);
        } else if (onSelect) {
            onSelect(student);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Keresés..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {multipleSelection && (
                                <TableHead className="w-[40px]">
                                    <Checkbox
                                        checked={
                                            filteredStudents.length > 0 &&
                                            selectedIds.size ===
                                                filteredStudents.length
                                        }
                                        onCheckedChange={toggleSelectAll}
                                        aria-label="Összes kijelölése"
                                    />
                                </TableHead>
                            )}
                            <TableHead>Azonosító</TableHead>
                            <TableHead>Név</TableHead>
                            <TableHead>Osztály</TableHead>
                            <TableHead>Regisztrálva</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={multipleSelection ? 6 : 5}
                                    className="h-24 text-center"
                                >
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Betöltés...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredStudents.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={multipleSelection ? 6 : 5}
                                    className="h-24 text-center"
                                >
                                    Nincs egy diák sem.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStudents.map((student) => (
                                <TableRow
                                    key={student.id}
                                    className={`cursor-pointer hover:bg-muted/50 ${
                                        selectedIds.has(student.id)
                                            ? "bg-muted/70"
                                            : ""
                                    }`}
                                    onClick={() => handleRowClick(student)}
                                >
                                    {multipleSelection && (
                                        <TableCell
                                            className="w-[40px]"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Checkbox
                                                checked={selectedIds.has(
                                                    student.id
                                                )}
                                                onCheckedChange={() =>
                                                    toggleSelectStudent(student)
                                                }
                                                aria-label={`Select ${student.name}`}
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell>{student.uniqueId}</TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.grade}</TableCell>
                                    <TableCell>
                                        {format(
                                            new Date(student.createdAt),
                                            "MMM d, yyyy h:mm a"
                                        )}
                                    </TableCell>
                                    <TableCell
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <span className="sr-only">
                                                        Open menu
                                                    </span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setEditingStudent(
                                                            student
                                                        )
                                                    }
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Módosítás
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() =>
                                                        setStudentToDelete(
                                                            student
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Törlés
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog
                open={!!editingStudent}
                onOpenChange={(open) => !open && setEditingStudent(null)}
            >
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Diák adatainak szerkesztése</DialogTitle>
                    </DialogHeader>
                    {editingStudent && (
                        <StudentUploadForm
                            student={editingStudent}
                            onSuccess={handleEditSuccess}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={!!studentToDelete}
                onOpenChange={(open) => !open && setStudentToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Biztosan törli a kijelölt diákot?</AlertDialogTitle>
                        <AlertDialogDescription>Törlés</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Mégsem
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteStudent}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Törlés
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
