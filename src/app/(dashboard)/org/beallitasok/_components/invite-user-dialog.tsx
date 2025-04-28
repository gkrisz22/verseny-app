"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2Icon, Plus } from "lucide-react";
import { useActionForm } from "@/hooks/use-action-form";
import FormField from "@/app/(dashboard)/_components/common/form-field";
import { UserStatus } from "@prisma/client";
import { handleOrgUser } from "@/app/_actions/organization.action";

const roleLabels: Record<string, string> = {
    admin: "Adminisztrátor",
    teacher: "Tanár",
};

const HandleOrgUserDialog = ({
    children,
    user,
}: {
    children?: React.ReactNode;
    user?: {
        id: string;
        name: string;
        email: string;
        roles: string[];
        status: UserStatus;
    };
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [roles, setRoles] = React.useState<{ role: string; checked: boolean }[]>([
        { role: "admin", checked: false },
        { role: "teacher", checked: false },
    ]);

    const [state, action, isPending] = useActionForm(handleOrgUser, {
        onSuccess: () => {
            setIsOpen(false);
        },
    });

    const handleChange = (role: string) => {
        setRoles((prev) =>
            prev.map((r) =>
                r.role === role ? { ...r, checked: !r.checked } : r
            )
        );
    };

    React.useEffect(() => {
        if (user) {
            setRoles([
                { role: "admin", checked: user.roles.includes("admin") },
                { role: "teacher", checked: user.roles.includes("teacher") },
            ]);
        }
    }, [user]);
    
    React.useEffect(() => {
        if (state?.inputs?.roles) {
            const selectedRoles = state.inputs.roles.split("&");
            setRoles((prev) =>
                prev.map((r) => ({
                    ...r,
                    checked: selectedRoles.includes(r.role),
                }))
            );
        }
    }, [state?.inputs?.roles]);
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button className="w-fit" size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Új felhasználó
                        meghívása
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <form action={action}>
                    <DialogHeader>
                        <DialogTitle>
                            {user
                                ? "Felhasználó módosítása"
                                : "Új felhasználó meghívása"}
                        </DialogTitle>
                        <DialogDescription>
                            {user
                                ? "Itt módosíthatja a kiválasztott felhasználót."
                                : "Itt hívhat meg egy új felhasználót a szervezetébe."}
                        </DialogDescription>
                    </DialogHeader>
                    {user && (
                        <input type="hidden" name="userId" value={user.id} />
                    )}
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-4">
                            <FormField
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Teljes név"
                                defaultValue={state?.inputs?.name || user?.name}
                                errors={state?.errors?.name}
                                label="Név"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <FormField
                                id="email"
                                name="email"
                                type="email"
                                placeholder="E-mail cím"
                                defaultValue={
                                    state?.inputs?.email || user?.email
                                }
                                errors={state?.errors?.email}
                                label="E-mail cím"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <Label className="text-sm font-medium">
                                Szerepkör(ök)
                            </Label>
                            <div className="space-y-2">
                                {roles.map((role) => (
                                    <div
                                        key={role.role}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={`role-${role.role}`}
                                            checked={role.checked}
                                            onCheckedChange={() =>
                                                handleChange(role.role)
                                            }
                                        />
                                        <Label
                                            htmlFor={`role-${role.role}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {roleLabels[role.role]}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <input
                                type="hidden"
                                name="roles"
                                value={roles
                                    .filter((r) => r.checked)
                                    .map((r) => r.role)
                                    .join("&")}
                            />
                            {state?.errors?.roles && (
                                <p className="text-sm text-red-500">
                                    {state.errors.roles}
                                </p>
                            )}
                        </div>
                        {user && (
                            <div className="flex flex-col gap-4">
                                <FormField
                                    id="isActive"
                                    name="isActive"
                                    type="switch"
                                    placeholder="Aktív"
                                    defaultValue={
                                        state?.inputs?.isActive === "true" ||
                                        user.status === "ACTIVE" ||
                                        false
                                    }
                                    errors={state?.errors?.isActive}
                                    label="Aktív"
                                    required
                                />
                            </div>
                        )}
                        {state?.message && !state?.success && (
                            <p className="text-sm text-red-500">
                                {state.message}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={"outline"}>Mégsem</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending && (
                                <span className="animate-spin mr-2">
                                    <Loader2Icon />
                                </span>
                            )}{" "}
                            {user ? "Módosítás" : "Meghívás"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default HandleOrgUserDialog;
