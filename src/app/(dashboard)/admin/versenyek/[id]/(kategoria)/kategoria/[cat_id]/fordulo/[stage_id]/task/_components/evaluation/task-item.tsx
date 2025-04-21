"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { Task, TaskType } from "./evaluation-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, ChevronRight, ChevronDown, Edit, Check, X, ListChecks, Hash } from "lucide-react"

interface HierarchicalTask extends Task {
  children: HierarchicalTask[]
  totalPoints: number
}

interface TaskItemProps {
  task: HierarchicalTask
  taskGroupId: string
  level: number
  expanded: boolean
  expandedTasks: Record<string, boolean>
  toggleExpanded: (taskId: string) => void
  updateTask: (taskGroupId: string, taskId: string, updates: Partial<Task>) => void
  removeTask: (taskGroupId: string, taskId: string) => void
  addTask: (parentId: string | null) => void
  isNewlyCreated?: boolean
  onFinishEditing?: () => void
  newlyCreatedId?: string | null
}

export default function TaskItem({
  task,
  taskGroupId,
  level,
  expanded,
  expandedTasks,
  toggleExpanded,
  updateTask,
  removeTask,
  addTask,
  isNewlyCreated = false,
  onFinishEditing = () => {},
  newlyCreatedId = null,
}: TaskItemProps) {
  const [editing, setEditing] = useState(isNewlyCreated)
  const [editData, setEditData] = useState({
    title: task.title,
    points: task.points,
    type: task.type,
  })

  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && nameInputRef.current) {
      nameInputRef.current.focus()
      nameInputRef.current.select()
    }
  }, [editing])

  const hasChildren = task.children && task.children.length > 0
  const childrenPoints = task.totalPoints - task.points

  const saveEdits = () => {
    if (editData.title.trim()) {
      updateTask(taskGroupId, task.id, {
        title: editData.title,
        points: editData.points,
        type: editData.type,
      })
      setEditing(false)
      if (isNewlyCreated) {
        onFinishEditing()
      }
    }
  }

  const cancelEdits = () => {
    setEditData({
      title: task.title,
      points: task.points,
      type: task.type,
    })
    setEditing(false)
    if (isNewlyCreated) {
      onFinishEditing()
    }
  }

  const handleAddTask = () => {
    addTask(task.id)
    if (!expanded) {
      toggleExpanded(task.id)
    }
  }

  return (
    <div className="space-y-2">
      <Card className={`border-l-4 ${level === 0 ? "border-l-primary" : "border-l-muted-foreground"} ${editing ? "ring-2 ring-primary ring-offset-2" : ""}`}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              {hasChildren && (
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={() => toggleExpanded(task.id)}>
                  {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}

              {editing ? (
                <Input
                  ref={nameInputRef}
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="h-8 max-w-[400px] w-full text-base"
                  autoFocus
                />
              ) : (
                <div className="font-medium text-base">{task.title}</div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {editing ? (
                <div className="flex items-center gap-2">
                  <Select value={editData.type} onValueChange={(value) => setEditData({ ...editData, type: value as TaskType })}>
                    <SelectTrigger className="w-[130px] h-8">
                      <SelectValue placeholder="Task Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NUMERIC">Numeric</SelectItem>
                      <SelectItem value="BINARY">Binary</SelectItem>
                      <SelectItem value="TEXT">Text</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    value={editData.points}
                    onChange={(e) => setEditData({ ...editData, points: Number(e.target.value) || 0 })}
                    className="h-8 w-16"
                  />
                  <Button variant="ghost" size="icon" onClick={saveEdits} className="h-7 w-7">
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={cancelEdits} className="h-7 w-7">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <>
                  <Badge variant="outline" className="mr-2">
                    {hasChildren ? `${task.points} + ${childrenPoints}` : task.points} pont
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => setEditing(true)} className="h-7 w-7">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeTask(taskGroupId, task.id)} className="h-7 w-7">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleAddTask} className="h-7 w-7">
                    <Plus className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {expanded && hasChildren && (
        <div className="pl-6 space-y-2">
          {task.children.map((child) => (
            <TaskItem
              key={child.id}
              task={child}
              taskGroupId={taskGroupId}
              level={level + 1}
              expanded={!!expandedTasks[child.id]}
              expandedTasks={expandedTasks}
              toggleExpanded={toggleExpanded}
              updateTask={updateTask}
              removeTask={removeTask}
              addTask={addTask}
              isNewlyCreated={child.id === newlyCreatedId}
              onFinishEditing={onFinishEditing}
              newlyCreatedId={newlyCreatedId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
