"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import TaskContent from "./task-content"
import { v4 as uuidv4 } from "uuid"

export type TaskType = "numerical" | "checkbox"

export interface Subtask {
  id: string
  name: string
  parentId: string | null
  points: number
  taskType: TaskType
}

export interface Task {
  id: string
  name: string
  subtasks: Subtask[]
}

export default function EvaluationTable() {

    const [tasks, setTasks] = useState<Task[]>([
        {
          id: uuidv4(),
          name: "1. feladat",
          subtasks: []
        }
    ]);

    const [activeTab, setActiveTab] = useState(tasks[0]?.id || "")

    const addTask = () => {
        const newTaskId = uuidv4()
        const newTask: Task = {
            id: newTaskId,
            name: `Task ${tasks.length + 1}`,
            subtasks: [
                {
                id: uuidv4(),
                name: "Feladat",
                parentId: null,
                points: 1,
                taskType: "numerical" as TaskType,
                },
            ],
        }

    setTasks([...tasks, newTask])
    setActiveTab(newTaskId)
  }

  const removeTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)

    if (activeTab === taskId && updatedTasks.length > 0) {
      setActiveTab(updatedTasks[0].id)
    }
  }

  const updateTaskName = (taskId: string, newName: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, name: newName } : task)))
  }

  const addSubtask = (taskId: string, parentId: string | null) => {
    const newSubtaskId = uuidv4()
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: [
              ...task.subtasks,
              {
                id: newSubtaskId,
                name: "New Criteria",
                parentId,
                points: 5,
                taskType: "numerical",
              },
            ],
          }
        }
        return task
      }),
    )
    return newSubtaskId
  }

  const updateSubtask = (taskId: string, subtaskId: string, updates: Partial<Subtask>) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.map((subtask) => (subtask.id === subtaskId ? { ...subtask, ...updates } : subtask)),
          }
        }
        return task
      }),
    )
  }

  const removeSubtask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.filter(
            (subtask) => subtask.id !== subtaskId && subtask.parentId !== subtaskId,
          )
          return { ...task, subtasks: updatedSubtasks }
        }
        return task
      }),
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight" && index < tasks.length - 1) {
      setActiveTab(tasks[index + 1].id)
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveTab(tasks[index - 1].id)
    }
  }

  return (
    <div className="space-y-4 mt-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4 bg-background rounded-lg">
          <TabsList className="overflow-x-auto bg-background rounded-lg">
            {tasks.map((task, index) => (
              <TabsTrigger
                key={task.id}
                value={task.id}
                className="flex items-center gap-2"
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                {task.name}
                {tasks.length > 1 && (
                  <Button
                  asChild
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeTask(task.id)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button onClick={addTask} size="sm" className="ml-2">
            <Plus className="h-4 w-4 mr-1" /> Új feladatcsoport
          </Button>
        </div>

        {tasks.map((task) => (
          <TabsContent key={task.id} value={task.id} className="border rounded-lg p-4">
            <TaskContent
              task={task}
              updateTaskName={updateTaskName}
              addSubtask={addSubtask}
              updateSubtask={updateSubtask}
              removeSubtask={removeSubtask}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

