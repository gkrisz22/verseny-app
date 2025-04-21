"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2Icon, Plus } from "lucide-react";
import { useActionForm } from "@/hooks/use-action-form";
import { inviteOrgUser } from "@/app/_actions/organization.action";

const InviteUserDialog = () => {
    const [isAddUserOpen, setIsAddUserOpen] = React.useState(false);
    const [state, action, isPending] = useActionForm(inviteOrgUser);
    const [roles, setRoles] = React.useState<{ role: string; checked: boolean }[]>([
        { role: "admin", checked: false },
        { role: "contact", checked: false },
        { role: "trusted", checked: false },
        { role: "teacher", checked: false },
    ]);

    const handleChange = (role: string) => {
        setRoles((prev) => prev.map((r) => (r.role === role ? { ...r, checked: !r.checked } : r)));
    };

    React.useEffect(() => {
        if (state.inputs) {
            const selectedRoles = state.inputs.roles.split("&");
            setRoles((prev) => prev.map((r) => (selectedRoles.includes(r.role) ? { ...r, checked: true } : { ...r, checked: false })));
        }
        if (state.success) setIsAddUserOpen(false);
    }, [state, state.success, state?.errors, state?.inputs]);

    return (
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
                <Button className="w-fit" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Új felhasználó meghívása
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form action={action}>
                    <DialogHeader>
                        <DialogTitle>Új felhasználó meghívása</DialogTitle>
                        <DialogDescription>Hívjon meg egy új felhasználót a szervezetébe.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="name" className="text-sm font-medium">Név</Label>
                            <Input id="name" name="name" placeholder="Teljes név" defaultValue={state?.inputs?.name} />
                            {state?.errors?.name && <p className="text-sm text-red-500">{state.errors.name}</p>}
                        </div>
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="email" className="text-sm font-medium">E-mail cím</Label>
                            <Input id="email" name="email" type="email" placeholder="E-mail cím" defaultValue={state?.inputs?.email} />
                            {state?.errors?.email && <p className="text-sm text-red-500">{state.errors.email}</p>}
                        </div>
                        <div className="flex flex-col gap-4">
                            <Label className="text-sm font-medium">Szerepkör(ök)</Label>
                            <div className="space-y-2">
                                {roles.map((role) => (
                                    <div key={role.role} className="flex items-center space-x-2">
                                        <Checkbox id={`role-${role.role}`} checked={role.checked} onCheckedChange={() => handleChange(role.role)} />
                                        <Label htmlFor={`role-${role.role}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {role.role.charAt(0).toUpperCase() + role.role.slice(1)}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <input type="hidden" name="roles" value={roles.filter((r) => r.checked).map((r) => r.role).join("&")} />
                            {state?.errors?.roles && <p className="text-sm text-red-500">{state.errors.roles}</p>}
                        </div>
                        {state?.message && !state?.success && <p className="text-sm text-red-500">{state.message}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)}>Mégsem</Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <span className="animate-spin mr-2"><Loader2Icon /></span>} Meghívás
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default InviteUserDialog;