"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import TaskContent from "./task-content"
import { v4 as uuidv4 } from "uuid"
import EvaluationSaveTrigger from "./save-button"
import { deleteTaskGroup, saveTasks, updateTaskGroup } from "@/app/_actions/task.action"
import CreateTaskGroupDialog from "./create-task-group-dialog"
import { ConfirmDialog } from "@/app/(dashboard)/_components/common/confirm-dialog"
import { toast } from "sonner"

export type TaskType = "NUMERIC" | "BINARY" | "TEXT";

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  points: number;
  parentId: string | null;
}

export interface TaskGroup {
  id: string;
  title: string;
  stageId: string;
  tasks: Task[];
}

export default function EvaluationTable({ stageId, initialGroups }: { stageId: string
, initialGroups: TaskGroup[] }) {
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>(initialGroups);
  const [activeTab, setActiveTab] = useState(taskGroups[0]?.id || "");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const addTaskGroup = ({ id, title, stageId}: { id: string, title: string, stageId: string }) => {
    const newTaskGroup ={
      id,
      title,
      stageId,
      tasks: [],
    }

    setTaskGroups([...taskGroups, newTaskGroup]);
    setActiveTab(newTaskGroup.id);
  };

  const removeTaskGroup = async (taskGroupId: string) => {
    const res = await deleteTaskGroup(taskGroupId);
    if(!res) {
      toast.error("Nem sikerült törölni a feladatcsoportot.");
      return;
    }

    const updatedTaskGroups = taskGroups.filter((group) => group.id !== taskGroupId);
    setTaskGroups(updatedTaskGroups);

    if (activeTab === taskGroupId && updatedTaskGroups.length > 0) {
      setActiveTab(updatedTaskGroups[0].id);
    }
  };

  const updateTaskGroupTitle = async (taskGroupId: string, newTitle: string) => {
    const res = await updateTaskGroup(taskGroupId, { title: newTitle });
    if(!res) {
      toast.error("Nem sikerült frissíteni a feladatcsoport nevét.");
      return;
    }
    setTaskGroups(
      taskGroups.map((group) =>
        group.id === taskGroupId ? { ...group, title: newTitle } : group
      )
    );
  };

  const addTask = (taskGroupId: string, parentId: string | null) => {
    const newTaskId = uuidv4();
    const parentTask = taskGroups
      .find((group) => group.id === taskGroupId)
      ?.tasks.find((task) => task.id === parentId);

    setTaskGroups(
      taskGroups.map((group) => {
        if (group.id === taskGroupId) {
          return {
            ...group,
            tasks: [
              ...group.tasks,
              {
                id: newTaskId,
                title: "Feladat",
                type: parentTask?.type || "NUMERIC",
                points: 1,
                parentId,
                subtasks: [],
              },
            ],
          };
        }
        return group;
      })
    );
    return newTaskId;
  };

  const updateTask = (taskGroupId: string, taskId: string, updates: Partial<Task>) => {
    setTaskGroups(
      taskGroups.map((group) => {
        if (group.id === taskGroupId) {
          return {
            ...group,
            tasks: group.tasks.map((task) =>
              task.id === taskId ? { ...task, ...updates } : task
            ),
          };
        }
        return group;
      })
    );
  };

  const removeTask = (taskGroupId: string, taskId: string) => {
    setTaskGroups(
      taskGroups.map((group) => {
        if (group.id === taskGroupId) {
          const updatedTasks = group.tasks.filter(
            (task) => task.id !== taskId && task.parentId !== taskId
          );
          return { ...group, tasks: updatedTasks };
        }
        return group;
      })
    );
  };

  const handleSave = async () => {
    console.log("Saving tasks:", taskGroups);
    const res = await saveTasks(taskGroups);
    if (!res) {
      toast.error("Nem sikerült menteni a feladatokat.");
      return;
    }
    toast.success("Feladatok sikeresen mentve!");
    const toSave = taskGroups.map((group) => ({
      id: group.id,
      title: group.title,
      stageId: group.stageId,
      tasks: group.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        type: task.type,
        points: task.points,
        parentId: task.parentId,
      })),
    }));

    setTaskGroups(toSave);
  };

  return (
    <div className="space-y-4 mt-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4 bg-background rounded-lg">
          <TabsList className="overflow-x-auto rounded-lg">
            {taskGroups.map((group, index) => (
              <TabsTrigger
                key={group.id}
                value={group.id}
                className="flex items-center gap-2"
              >
                {group.title}
                {taskGroups.length > 1 && (
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGroup(group.id);
                      setIsDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <CreateTaskGroupDialog stageId={stageId} onAdded={addTaskGroup} />
        </div>

        {taskGroups.map((group) => (
          <TabsContent key={group.id} value={group.id} className="border rounded-lg p-4">
            <TaskContent
              taskGroup={group}
              updateTaskGroupTitle={updateTaskGroupTitle}
              addTask={addTask}
              updateTask={updateTask}
              removeTask={removeTask}
            />
          </TabsContent>
        ))}
      </Tabs>
      <EvaluationSaveTrigger onSave={handleSave} disabled={false} />
      <ConfirmDialog
        title="A feladatcsoport törlésével a hozzátartozó ÖSSZES feladat is törlődik!"
        description="Biztosan törölni szeretné a feladatcsoportot?"
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
        confirmButton={
          <Button variant="destructive" onClick={() => {removeTaskGroup(selectedGroup || ""); setIsDeleteOpen(false);}}>
            Törlés
          </Button>
        }
      >
      </ConfirmDialog>
    </div>
  );
}
