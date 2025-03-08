"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskList } from "./task-list";
import { Input } from "@/components/ui/input";

export interface Subtask {
  id: string;
  title: string;
  maxPoints: number;
  subtasks: Subtask[];
}

export interface Task {
  id: string;
  title: string;
  subtasks: Subtask[];
}

export function EvaluationTable() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: uuidv4(),
      title: "1. feladat",
      subtasks: [],
    },
  ]);

  const [activeTab, setActiveTab] = useState(tasks[0]?.id || "");

  const addNewTask = () => {
    const newTask = {
      id: uuidv4(),
      title: `${tasks.length + 1}. feladat`,
      subtasks: [],
    };
    setTasks([...tasks, newTask]);
    setActiveTab(newTask.id);
  };

  const addSubtask = (taskId: string, parentId: string | null = null) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          if (!parentId) {
            return {
              ...task,
              subtasks: [
                ...task.subtasks,
                {
                  id: uuidv4(),
                  title: `${task.subtasks.length + 1}. alfeladat`,
                  maxPoints: 10,
                  subtasks: [],
                },
              ],
            };
          } else {
            return {
              ...task,
              subtasks: addNestedSubtask(task.subtasks, parentId),
            };
          }
        }
        return task;
      })
    );
  };

  const addNestedSubtask = (
    subtasks: Subtask[],
    parentId: string
  ): Subtask[] => {
    return subtasks.map((subtask) => {
      if (subtask.id === parentId) {
        return {
          ...subtask,
          subtasks: [
            ...subtask.subtasks,
            {
              id: uuidv4(),
              title: `${subtask.subtasks.length + 1}. alfeladat`,
              maxPoints: 10,
              subtasks: [],
            },
          ],
        };
      }
      if (subtask.subtasks.length > 0) {
        return {
          ...subtask,
          subtasks: addNestedSubtask(subtask.subtasks, parentId),
        };
      }
      return subtask;
    });
  };

  const updateSubtask = (
    taskId: string,
    subtaskId: string,
    updates: Partial<Subtask>
  ) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: updateNestedSubtask(task.subtasks, subtaskId, updates),
          };
        }
        return task;
      })
    );
  };

  const updateNestedSubtask = (
    subtasks: Subtask[],
    subtaskId: string,
    updates: Partial<Subtask>
  ): Subtask[] => {
    return subtasks.map((subtask) => {
      if (subtask.id === subtaskId) {
        return { ...subtask, ...updates };
      }
      if (subtask.subtasks.length > 0) {
        return {
          ...subtask,
          subtasks: updateNestedSubtask(subtask.subtasks, subtaskId, updates),
        };
      }
      return subtask;
    });
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: deleteNestedSubtask(task.subtasks, subtaskId),
          };
        }
        return task;
      })
    );
  };

  const deleteNestedSubtask = (
    subtasks: Subtask[],
    subtaskId: string
  ): Subtask[] => {
    return subtasks
      .filter((subtask) => subtask.id !== subtaskId)
      .map((subtask) => {
        if (subtask.subtasks.length > 0) {
          return {
            ...subtask,
            subtasks: deleteNestedSubtask(subtask.subtasks, subtaskId),
          };
        }
        return subtask;
      });
  };

  const updateTaskTitle = (taskId: string, title: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, title };
        }
        return task;
      })
    );
  };

  const deleteTask = (taskId: string) => {
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);

    if (activeTab === taskId && newTasks.length > 0) {
      setActiveTab(newTasks[0].id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Feladatok</h2>
          <Button onClick={addNewTask} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Új feladat
          </Button>
        </div>

        {tasks.length > 0 ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4 flex flex-wrap">
              {tasks.map((task) => (
                <TabsTrigger
                  key={task.id}
                  value={task.id}
                  className="flex-grow"
                >
                  {task.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {tasks.map((task) => (
              <TabsContent key={task.id} value={task.id} className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <Input
                    type="text"
                    value={task.title}
                    onChange={(e) => updateTaskTitle(task.id, e.target.value)}
                    className="text-lg font-medium bg-transparent w-full max-w-[250px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => addSubtask(task.id)}
                      variant="outline"
                      size="sm"
                    >
                      Új alfeladat
                    </Button>
                    {tasks.length > 1 && (
                      <Button
                        onClick={() => deleteTask(task.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Törlés
                      </Button>
                    )}
                  </div>
                </div>

                <TaskList
                  taskId={task.id}
                  subtasks={task.subtasks}
                  onAddSubtask={(parentId) => addSubtask(task.id, parentId)}
                  onUpdateSubtask={(subtaskId, updates) =>
                    updateSubtask(task.id, subtaskId, updates)
                  }
                  onDeleteSubtask={(subtaskId) =>
                    deleteSubtask(task.id, subtaskId)
                  }
                  level={0}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nincs feladat létrehozva.
          </div>
        )}
      </div>
    </div>
  );
}
