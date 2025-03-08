"use client";

import { useState } from "react";
import type { Subtask } from "./evaluation-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskListProps {
  taskId: string;
  subtasks: Subtask[];
  onAddSubtask: (parentId: string) => void;
  onUpdateSubtask: (subtaskId: string, updates: Partial<Subtask>) => void;
  onDeleteSubtask: (subtaskId: string) => void;
  level: number;
}

export function TaskList({
  taskId,
  subtasks,
  onAddSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
  level,
}: TaskListProps) {
  const [expandedSubtasks, setExpandedSubtasks] = useState<
    Record<string, boolean>
  >({});

  const toggleExpand = (subtaskId: string) => {
    setExpandedSubtasks((prev) => ({
      ...prev,
      [subtaskId]: !prev[subtaskId],
    }));
  };

  const getIndentation = (level: number) => {
    console.log(level, taskId);
    return `w-${level * 12}`;
  };

  const getPrefix = (index: number, level: number) => {
    if (level === 0) {
      return `${index + 1}.`;
    } else if (level === 1) {
      return `${String.fromCharCode(97 + index)})`; // a - z
    } else if (level === 2) {
      return `${String.fromCharCode(105 + index)}.`; 
    } else {
      return `•`;
    }
  };

  return (
    <div className="space-y-2">
      {subtasks.map((subtask, index) => (
        <div
          key={subtask.id}
          className={`${level > 0 ? `ml-${level * 6}` : ""}`}
        >
          <div className="flex items-center gap-2 group">
            {subtask.subtasks.length > 0 ? (
              <button
                onClick={() => toggleExpand(subtask.id)}
                className="p-1 rounded-full hover:bg-muted"
              >
                {expandedSubtasks[subtask.id] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ) : (
              <span className="w-6" />
            )}


            <span
            style={{marginLeft: level * 6 + "px"}}
            className={cn("min-w-[10px]",
                "ml-" + level * 6,
            )}
            >{getPrefix(index, level)}</span>

            <Input
              value={subtask.title}
              onChange={(e) =>
                onUpdateSubtask(subtask.id, { title: e.target.value })
              }
              className="flex-grow"
            />

            <Input
              type="number"
              value={subtask.maxPoints}
              onChange={(e) =>
                onUpdateSubtask(subtask.id, {
                  maxPoints: Number.parseInt(e.target.value) || 0,
                })
              }
              className="w-20"
              placeholder="Points"
            />

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                onClick={() => onAddSubtask(subtask.id)}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => onDeleteSubtask(subtask.id)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {expandedSubtasks[subtask.id] && subtask.subtasks.length > 0 && (
            <TaskList
              taskId={taskId}
              subtasks={subtask.subtasks}
              onAddSubtask={onAddSubtask}
              onUpdateSubtask={onUpdateSubtask}
              onDeleteSubtask={onDeleteSubtask}
              level={level + 1}
            />
          )}
        </div>
      ))}

      {subtasks.length === 0 && level === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          Nincs alfeladat létrehozva ehhez a feladathoz.
        </div>
      )}
    </div>
  );
}
