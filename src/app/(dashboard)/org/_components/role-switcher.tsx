'use client'

import { useState } from 'react';
import { saveRolePreference } from '@/app/_actions/organization.action';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner';

export default function RoleSwitcher({ availableRoles, activeRole, orgId } : { availableRoles: string[], activeRole: string, orgId: string }) {
  const [role, setRole] = useState(activeRole);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRoleChange = async (newRole:string) => {
    if (!availableRoles.includes(newRole)) return;
    setRole(newRole);
    toast.promise(saveRolePreference(orgId, newRole), {
      loading: "Szerepkörváltás...",
      success: "Szerepkörváltás sikeres",
    });
  };
  
  return (
    <div className="flex items-center gap-2">  
      <Select onValueChange={handleRoleChange} value={role}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Szerepkörök" />
        </SelectTrigger>
        <SelectContent>
          {availableRoles.map(role => (
            <SelectItem key={role} value={role}>{role}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isLoading && <span className="text-xs text-gray-500">Szerepkörváltás...</span>}
    </div>
  );
}