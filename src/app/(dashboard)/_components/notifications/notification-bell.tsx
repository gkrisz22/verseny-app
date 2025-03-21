"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNotifications, type NotificationType } from "./notification-provider"

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [open, setOpen] = useState(false)

  const recentUnreadNotifications = notifications
    .filter((notification) => notification.status === "unread")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5)

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id)
    setOpen(false)
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Értesítések</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Értesítések</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mind olvasott
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {recentUnreadNotifications.length > 0 ? (
          <>
            {recentUnreadNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="p-0 focus:bg-transparent"
                onSelect={(e) => e.preventDefault()}
              >
                <Link
                  href={notification.link || "#"}
                  className="flex w-full cursor-pointer items-start gap-3 p-4 hover:bg-accent"
                  onClick={() => handleNotificationClick(notification.id, notification.link)}
                >
                  <div className="flex-shrink-0">
                    {notification.sender?.avatar ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={notification.sender.avatar} alt={notification.sender.name} />
                        <AvatarFallback>{notification.sender.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className={`h-8 w-8 rounded-full ${getNotificationIcon(notification.type)}`} />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
              <Link
                href="/organization/notifications"
                className="flex w-full cursor-pointer items-center justify-center p-2 font-medium"
                onClick={() => setOpen(false)}
              >
                Összes értesítés
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            <p className="text-sm text-muted-foreground">Nincs új értesítés.</p>
            <Link
              href="/organization/notifications"
              className="mt-2 text-sm font-medium text-primary"
              onClick={() => setOpen(false)}
            >
              Összes értesítés
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

