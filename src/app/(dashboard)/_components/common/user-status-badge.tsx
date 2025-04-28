import { Badge } from "@/components/ui/badge"

export const UserStatusBadge = ({status} : {status: "ACTIVE" | "INACTIVE" | "PENDING"}) => {
    switch (status) {
        case "ACTIVE":
            return <Badge variant="default">Aktív</Badge>
        case "INACTIVE":
            return <Badge variant="destructive">Inaktív</Badge>
        case "PENDING":
            return <Badge variant="secondary">Függőben</Badge>
        default:
            return <Badge variant="outline">Ismeretlen</Badge>
    }
}