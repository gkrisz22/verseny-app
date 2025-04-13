"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DataTable } from "../../_components/common/data-table"
import { columns, User } from "./columns"
import { Plus } from "lucide-react"

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Géczy Krisztián",
      email: "mf5m7s@inf.elte.hu",

      roles: ["admin", "teacher"],
      status: "active",
      joinedDate: "Jan 15, 2024",
    },
    {
      id: "2",
      name: "Teszt user",
      email: "teszt.user@inf.elte.hu",
      roles: ["trusted", "contact"],
      status: "active",
      joinedDate: "Feb 3, 2024",
    },
  ])

  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Felhasználók kezelése</h1>
          <p className="text-muted-foreground mt-2">Adjon hozzá új felhasználókat, töröljön, vagy módosítsa szerepköreit, adatait a szervezete tagjainak.</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Új felhasználó hozzáadása
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Új felhasználó meghívása</DialogTitle>
              <DialogDescription>Hívjon meg egy új felhasználót a szervezetébe.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-sm font-medium">
                  Név
                </Label>
                <Input id="name" placeholder="Teljes név" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right text-sm font-medium">
                  E-mail cím
                </label>
                <Input id="email" type="email" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Roles</label>
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="role-admin" />
                    <label
                      htmlFor="role-admin"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Adminisztrátor
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="role-contact" />
                    <label
                      htmlFor="role-contact"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Kapcsolattartó
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="role-trusted" />
                    <label
                      htmlFor="role-trusted"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Trusted User
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="role-teacher" />
                    <label
                      htmlFor="role-teacher"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Tanár
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Mégsem
              </Button>
              <Button onClick={() => setIsAddUserOpen(false)}>Meghívás</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border p-4">
        <DataTable data={users} columns={columns} searchParams={{
              column: "name",
              placeholder: "Keresés név alapján",
            }} />
      </div>
    </div>
  )
}

