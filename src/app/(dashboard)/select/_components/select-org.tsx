"use client";
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const SelectOrg = ({ roles}: {roles: {name: string, description: string}[]}) => {
    const [selected, setSelected] = React.useState<string>(roles[0].name)
    return (
        <div>
            <Select onValueChange={setSelected}  value={selected}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Válasszon szerepkört!" />
                </SelectTrigger>
                <SelectContent>
                    {
                        roles.map(role => (
                            <SelectItem key={role.name} value={role.name}>{role.description}</SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
            <input type="hidden" name="role" value={selected} />
        </div>
    )
}

export default SelectOrg