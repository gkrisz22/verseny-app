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
        title: "New Competition Registration",
        message: "A new participant has registered for Math Challenge 2025",
        type: "info",
        status: "unread",
        createdAt: new Date(Date.now() - 1000 * 60 * 5), 
        link: "/organization/competitions/active/1",
        sender: {
          id: "admin1",
          name: "System",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      },
      {
        id: "2",
        title: "Competition Update",
        message: "Science Olympiad registration deadline has been extended",
        type: "info",
        status: "unread",
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        link: "/organization/competitions/active/2",
        sender: {
          id: "admin2",
          name: "Admin",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      },
      {
        id: "3",
        title: "New User Joined",
        message: "Emily Davis has joined your organization as a teacher",
        type: "success",
        status: "unread",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        link: "/organization/users",
        sender: {
          id: "system",
          name: "System",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      },
      {
        id: "4",
        title: "System Maintenance",
        message: "The system will be down for maintenance on Sunday, 2AM-4AM",
        type: "warning",
        status: "read",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        sender: {
          id: "system",
          name: "System",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      },
      {
        id: "5",
        title: "Competition Results",
        message: "Results for Math Challenge 2024 have been published",
        type: "success",
        status: "read",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        link: "/organization/competitions/previous/1",
        sender: {
          id: "admin1",
          name: "System",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      },
      {
        id: "6",
        title: "Account Security",
        message: "Your password was changed successfully",
        type: "success",
        status: "archived",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
        sender: {
          id: "system",
          name: "System",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      },
      {
        id: "7",
        title: "Payment Processed",
        message: "Your payment for competition registration has been processed",
        type: "info",
        status: "archived",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 days ago
        link: "/organization/billing",
        sender: {
          id: "system",
          name: "System",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      },
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

    // Show a toast for the new notification
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

