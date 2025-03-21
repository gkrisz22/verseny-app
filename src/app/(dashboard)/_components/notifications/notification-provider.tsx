"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

export type NotificationType = "info" | "success" | "warning" | "error"
export type NotificationStatus = "unread" | "read" | "archived"

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  status: NotificationStatus
  createdAt: Date
  link?: string
  sender?: {
    id: string
    name: string
    avatar?: string
  }
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  archiveNotification: (id: string) => void
  deleteNotification: (id: string) => void
  sendNotification: (notification: Omit<Notification, "id" | "status" | "createdAt">) => void
  getFilteredNotifications: (status: NotificationStatus) => Notification[]
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Nemes Tihamér Alkalmazói Verseny",
        message: "Elindult a jelentkezési időszak az idei versenyre",
        type: "info",
        status: "unread",
        createdAt: new Date(Date.now() - 1000 * 60 * 5), 
        link: "/organization/versenyek/aktualis/1",
        sender: {
          id: "1",
          name: "Rendszer",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      },
      {
        id: "2",
        title: "Verseny módosítás",
        message: "A Nemes Tihamér verseny jelentkezési határideje meghosszabbodott.",
        type: "info",
        status: "unread",
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        link: "/organization/versenyek/aktualis/2",
        sender: {
          id: "1",
          name: "Rendszer",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      }
    ]

    setNotifications(mockNotifications)
  }, [])

  const unreadCount = notifications.filter((notification) => notification.status === "unread").length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, status: "read" } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.status === "unread" ? { ...notification, status: "read" } : notification,
      ),
    )
    toast("All notifications marked as read",{
      description: `${unreadCount} notifications have been marked as read.`,
    })
  }

  const archiveNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, status: "archived" } : notification)),
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const sendNotification = (notification: Omit<Notification, "id" | "status" | "createdAt">) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9),
      status: "unread",
      createdAt: new Date(),
    }

    setNotifications((prev) => [newNotification, ...prev])

    toast(notification.title, {
      description: notification.message,
    })
  }

  const getFilteredNotifications = (status: NotificationStatus) => {
    return notifications
      .filter((notification) => notification.status === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        archiveNotification,
        deleteNotification,
        sendNotification,
        getFilteredNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

