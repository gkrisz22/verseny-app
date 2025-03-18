"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Task, Subtask } from "./evaluation-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, SaveIcon, XIcon, SigmaIcon } from "lucide-react"
import TaskItem from "./task-item"

interface TaskContentProps {
  task: Task
  updateTaskName: (taskId: string, newName: string) => void
  addSubtask: (taskId: string, parentId: string | null) => string
  updateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void
  removeSubtask: (taskId: string, subtaskId: string) => void
}

interface HierarchicalSubtask extends Subtask {
  children: HierarchicalSubtask[]
  totalPoints: number
}

export default function TaskContent({
  task,
  updateTaskName,
  addSubtask,
  updateSubtask,
  removeSubtask,
}: TaskContentProps) {
  const [editingTaskName, setEditingTaskName] = useState(false)
  const [newTaskName, setNewTaskName] = useState(task.name)
  const [expandedSubtasks, setExpandedSubtasks] = useState<Record<string, boolean>>({})
  const [hierarchicalSubtasks, setHierarchicalSubtasks] = useState<HierarchicalSubtask[]>([])
  const [totalPoints, setTotalPoints] = useState(0)

  const [newlyCreatedSubtask, setNewlyCreatedSubtask] = useState<string | null>(null)

  useEffect(() => {
    const buildHierarchy = () => {
      const subtaskMap: Record<string, HierarchicalSubtask> = {}
      const rootSubtasks: HierarchicalSubtask[] = []

      task.subtasks.forEach((subtask) => {
        subtaskMap[subtask.id] = {
          ...subtask,
          children: [],
          totalPoints: subtask.points,
        }
      })

      task.subtasks.forEach((subtask) => {
        if (subtask.parentId === null) {
          rootSubtasks.push(subtaskMap[subtask.id])
        } else if (subtaskMap[subtask.parentId]) {
          subtaskMap[subtask.parentId].children.push(subtaskMap[subtask.id])
        }
      })

      const calculateTotalPoints = (subtask: HierarchicalSubtask): number => {
        if (subtask.children.length === 0) {
          return subtask.points
        }

        const childrenPoints = subtask.children.reduce((sum, child) => sum + calculateTotalPoints(child), 0)

        subtask.totalPoints = subtask.points + childrenPoints
        return subtask.totalPoints
      }

      let total = 0
      rootSubtasks.forEach((subtask) => {
        total += calculateTotalPoints(subtask)
      })

      setTotalPoints(total)
      return rootSubtasks
    }

    setHierarchicalSubtasks(buildHierarchy())
  }, [task.subtasks])

  const toggleExpanded = (subtaskId: string) => {
    setExpandedSubtasks((prev) => ({
      ...prev,
      [subtaskId]: !prev[subtaskId],
    }))
  }

  const saveTaskNameEdits = () => {
    if (newTaskName.trim()) {
      updateTaskName(task.id, newTaskName)
      setEditingTaskName(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && editingTaskName) {
      saveTaskNameEdits()
    } else if (e.key === "Escape" && editingTaskName) {
      setEditingTaskName(false)
    }
  }

  const handleAddSubtask = (parentId: string | null) => {
    const newSubtaskId = addSubtask(task.id, parentId)

    if (parentId) {
      setExpandedSubtasks((prev) => ({
        ...prev,
        [parentId]: true,
      }))
    }
    setNewlyCreatedSubtask(newSubtaskId)

    setExpandedSubtasks((prev) => ({
      ...prev,
      [newSubtaskId]: true,
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {editingTaskName ? (
          <div className="flex items-center gap-2">
            <Input
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full max-w-[300px] bg-background"
              autoFocus
            />
            <Button size="sm" onClick={saveTaskNameEdits}>
              <SaveIcon /> <span className="sr-only">Mentés</span>
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditingTaskName(false)}>
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Mégsem</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full mr-4">
            <h2 className="text-xl font-semibold">{task.name}</h2>
            <Button variant="ghost" size="icon" onClick={() => setEditingTaskName(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="ml-auto bg-background px-2">
              <SigmaIcon />{totalPoints} pont
            </Badge>
          </div>
        )}

        <Button size={"sm"} onClick={() => handleAddSubtask(null)}>
          <Plus className="h-4 w-4 mr-1" /> Új feladat
        </Button>
      </div>

      <div className="space-y-2">
        {hierarchicalSubtasks.map((subtask) => (
          <TaskItem
            key={subtask.id}
            subtask={subtask}
            taskId={task.id}
            level={0}
            expanded={expandedSubtasks[subtask.id] || false}
            expandedSubtasks={expandedSubtasks}
            toggleExpanded={toggleExpanded}
            updateSubtask={updateSubtask}
            removeSubtask={removeSubtask}
            addSubtask={handleAddSubtask}
            isNewlyCreated={subtask.id === newlyCreatedSubtask}
            onFinishEditing={() => setNewlyCreatedSubtask(null)}
            newlyCreatedId={newlyCreatedSubtask}
          />
        ))}
      </div>
    </div>
  )
}

