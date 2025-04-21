"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Task, TaskGroup } from "./evaluation-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, SaveIcon, XIcon, SigmaIcon } from "lucide-react"
import TaskItem from "./task-item"

interface TaskContentProps {
  taskGroup: TaskGroup
  updateTaskGroupTitle: (taskGroupId: string, newTitle: string) => void
  addTask: (taskGroupId: string, parentId: string | null) => string
  updateTask: (taskGroupId: string, taskId: string, updates: Partial<Task>) => void
  removeTask: (taskGroupId: string, taskId: string) => void
}

interface HierarchicalTask extends Task {
  children: HierarchicalTask[]
  totalPoints: number
}

export default function TaskContent({
  taskGroup,
  updateTaskGroupTitle,
  addTask,
  updateTask,
  removeTask,
}: TaskContentProps) {
  const [editingGroupTitle, setEditingGroupTitle] = useState(false)
  const [newGroupTitle, setNewGroupTitle] = useState(taskGroup.title)
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({})
  const [hierarchicalTasks, setHierarchicalTasks] = useState<HierarchicalTask[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [newlyCreatedTask, setNewlyCreatedTask] = useState<string | null>(null)

  useEffect(() => {
    const buildHierarchy = () => {
      const taskMap: Record<string, HierarchicalTask> = {}
      const rootTasks: HierarchicalTask[] = []

      taskGroup.tasks.forEach((task) => {
        taskMap[task.id] = {
          ...task,
          children: [],
          totalPoints: task.points,
        }
      })

      taskGroup.tasks.forEach((task) => {
        if (task.parentId === null) {
          rootTasks.push(taskMap[task.id])
        } else if (taskMap[task.parentId]) {
          taskMap[task.parentId].children.push(taskMap[task.id])
        }
      })

      const calculateTotalPoints = (task: HierarchicalTask): number => {
        if (task.children.length === 0) {
          return task.points
        }

        const childrenPoints = task.children.reduce((sum, child) => sum + calculateTotalPoints(child), 0)

        task.totalPoints = task.points + childrenPoints
        return task.totalPoints
      }

      let total = 0
      rootTasks.forEach((task) => {
        total += calculateTotalPoints(task)
      })

      setTotalPoints(total)
      return rootTasks
    }

    setHierarchicalTasks(buildHierarchy())
  }, [taskGroup.tasks])

  const toggleExpanded = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }))
  }

  const saveGroupTitleEdits = () => {
    if (newGroupTitle.trim()) {
      updateTaskGroupTitle(taskGroup.id, newGroupTitle)
      setEditingGroupTitle(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && editingGroupTitle) {
      saveGroupTitleEdits()
    } else if (e.key === "Escape" && editingGroupTitle) {
      setEditingGroupTitle(false)
    }
  }

  const handleAddTask = (parentId: string | null) => {
    const newTaskId = addTask(taskGroup.id, parentId)

    if (parentId) {
      setExpandedTasks((prev) => ({
        ...prev,
        [parentId]: true,
      }))
    }
    setNewlyCreatedTask(newTaskId)

    setExpandedTasks((prev) => ({
      ...prev,
      [newTaskId]: true,
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {editingGroupTitle ? (
          <div className="flex items-center gap-2">
            <Input
              value={newGroupTitle}
              onChange={(e) => setNewGroupTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full max-w-[300px] bg-background"
              autoFocus
            />
            <Button size="sm" onClick={saveGroupTitleEdits}>
              <SaveIcon /> <span className="sr-only">Mentés</span>
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditingGroupTitle(false)}>
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Mégsem</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full mr-4">
            <h2 className="text-xl font-semibold">{taskGroup.title}</h2>
            <Button variant="ghost" size="icon" onClick={() => setEditingGroupTitle(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="ml-auto bg-background px-2">
              <SigmaIcon /> {totalPoints} pont
            </Badge>
          </div>
        )}

        <Button size={"sm"} onClick={() => handleAddTask(null)}>
          <Plus className="h-4 w-4 mr-1" /> Új feladat
        </Button>
      </div>

      <div className="space-y-2">
        {hierarchicalTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            taskGroupId={taskGroup.id}
            level={0}
            expanded={expandedTasks[task.id] || false}
            expandedTasks={expandedTasks}
            toggleExpanded={toggleExpanded}
            updateTask={updateTask}
            removeTask={removeTask}
            addTask={handleAddTask}
            isNewlyCreated={task.id === newlyCreatedTask}
            onFinishEditing={() => setNewlyCreatedTask(null)}
            newlyCreatedId={newlyCreatedTask}
          />
        ))}
      </div>
    </div>
  )
}
