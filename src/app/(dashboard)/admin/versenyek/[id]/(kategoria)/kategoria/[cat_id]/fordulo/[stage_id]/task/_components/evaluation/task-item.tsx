"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { Subtask, TaskType } from "./evaluation-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, ChevronRight, ChevronDown, Edit, Check, X, ListChecks, Hash } from "lucide-react"

interface HierarchicalSubtask extends Subtask {
    children: HierarchicalSubtask[]
    totalPoints: number
}

interface TaskItemProps {
    subtask: HierarchicalSubtask
    taskId: string
    level: number
    expanded: boolean
    expandedSubtasks: Record<string, boolean>
    toggleExpanded: (subtaskId: string) => void
    updateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void
    removeSubtask: (taskId: string, subtaskId: string) => void
    addSubtask: (parentId: string | null) => void
    isNewlyCreated?: boolean
    onFinishEditing?: () => void
    newlyCreatedId?: string | null
}

export default function TaskItem({
    subtask,
    taskId,
    level,
    expanded,
    expandedSubtasks,
    toggleExpanded,
    updateSubtask,
    removeSubtask,
    addSubtask,
    isNewlyCreated = false,
    onFinishEditing = () => { },
    newlyCreatedId = null,
}: TaskItemProps) {

    const [editing, setEditing] = useState(isNewlyCreated)
    const [editData, setEditData] = useState({
        name: subtask.name,
        points: subtask.points,
        taskType: subtask.taskType,
    })

    const nameInputRef = useRef<HTMLInputElement>(null)
    const pointsInputRef = useRef<HTMLInputElement>(null)
    const taskTypeRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (editing && nameInputRef.current) {
            nameInputRef.current.focus()
            nameInputRef.current.select()
        }
    }, [editing])

    useEffect(() => {
        if (isNewlyCreated) {
            setEditing(true)
        }
    }, [isNewlyCreated])

    const hasChildren = subtask.children && subtask.children.length > 0
    const childrenPoints = subtask.totalPoints - subtask.points

    const saveEdits = () => {
        if (editData.name.trim()) {
            updateSubtask(taskId, subtask.id, {
                name: editData.name,
                points: editData.points,
                taskType: editData.taskType,
            })
            setEditing(false)
            if (isNewlyCreated) {
                onFinishEditing()
            }
        }
    }

    const cancelEdits = () => {
        setEditData({
            name: subtask.name,
            points: subtask.points,
            taskType: subtask.taskType,
        })
        setEditing(false)
        if (isNewlyCreated) {
            onFinishEditing()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent, field: "name" | "points") => {
        if (e.key === "Enter") {
            saveEdits()
        } else if (e.key === "Escape") {
            cancelEdits()
        } else if (e.key === "Tab") {
            if (field === "name" && !e.shiftKey) {
                e.preventDefault()
                taskTypeRef.current?.click()
            }
        }

    }

    const handleAddSubtask = () => {
        addSubtask(subtask.id)
        if (!expanded) {
            toggleExpanded(subtask.id)
        }
    }

    const handleTaskTypeChange = (value: string) => {
        setEditData({
            ...editData,
            taskType: value as TaskType,
        })
    }

    const renderTaskTypeIcon = () => {
        return subtask.taskType === "numerical" ? (
            <Hash className="h-4 w-4 mr-1 text-muted-foreground" />
        ) : (
            <ListChecks className="h-4 w-4 mr-1 text-muted-foreground" />
        )
    }

    return (
        <div className="space-y-2">
            <Card
                className={`border-l-4 ${level === 0 ? "border-l-primary" : "border-l-muted-foreground"} ${editing ? "ring-2 ring-primary ring-offset-2" : ""}`}
            >
                <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                            {hasChildren && (
                                <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={() => toggleExpanded(subtask.id)}>
                                    {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </Button>
                            )}

                            {!editing && renderTaskTypeIcon()}

                            {editing ? (
                                <Input
                                    ref={nameInputRef}
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    onKeyDown={(e) => handleKeyDown(e, "name")}
                                    className="h-8 max-w-[400px] w-full text-base"
                                    autoFocus
                                />
                            ) : (
                                <div className="font-medium text-base">{subtask.name}</div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {editing ? (
                                <div className="flex items-center gap-2">
                                    <Select value={editData.taskType} onValueChange={handleTaskTypeChange}>
                                        <SelectTrigger className="w-[130px] h-8" ref={taskTypeRef} >
                                            <SelectValue placeholder="Feladattípus" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="numerical">
                                                <div className="flex items-center">
                                                    <Hash className="h-4 w-4 mr-2" />
                                                    <span>Szám</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="checkbox">
                                                <div className="flex items-center">
                                                    <ListChecks className="h-4 w-4 mr-2" />
                                                    <span>Bináris</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Input
                                        ref={pointsInputRef}
                                        type="number"
                                        value={editData.points}
                                        onChange={(e) => setEditData({ ...editData, points: Number.parseInt(e.target.value) || 0 })}
                                        onKeyDown={(e) => handleKeyDown(e, "points")}
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
                                    <div className="flex items-center gap-2">
                                        {subtask.taskType === "checkbox" && <Checkbox id={`checkbox-${subtask.id}`} className="mr-1" />}
                                        <Badge variant="outline" className="mr-2">
                                            {
                                                hasChildren ? (subtask.points == 0 ? childrenPoints : subtask.points + " + " + childrenPoints) : subtask.points
                                            } {" "}
                                            pont
                                        </Badge>
                                    </div>
                                    <div className="flex items-center">
                                        <Button variant="ghost" size="icon" onClick={() => setEditing(true)} className="h-7 w-7">
                                            <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeSubtask(taskId, subtask.id)}
                                            className="h-7 w-7"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={handleAddSubtask} className="h-7 w-7">
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {expanded && hasChildren && (
                <div className="pl-6 space-y-2">
                    {subtask.children.map((child) => (
                        <TaskItem
                            key={child.id}
                            subtask={child}
                            taskId={taskId}
                            level={level + 1}
                            expanded={!!expandedSubtasks[child.id]}
                            expandedSubtasks={expandedSubtasks}
                            toggleExpanded={toggleExpanded}
                            updateSubtask={updateSubtask}
                            removeSubtask={removeSubtask}
                            addSubtask={addSubtask}
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

