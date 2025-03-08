"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AddTaskDialog } from "./add-task-dialog";
import { ArrowUpDownIcon, ChevronsUpDownIcon, GripVerticalIcon, PlusIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { EvaluationTable } from "./evaluation-table";

interface EvaluatorBuilderProps {
  stageId: string;
}

interface Task {
  id: string;
  name: string;
}

const EvaluatorBuilder = ({ stageId }: EvaluatorBuilderProps) => {
  const [tasks, setTasks] = React.useState([
    { id: "1", name: "1. Prezentáció" },
    { id: "2", name: "2. Pixelgrafika" },
    { id: "3", name: "3. Szöveg - Ismertető" },
    { id: "4", name: "4. Szöveg - Karácsony" },
    { id: "5", name: "5. Táblázat" },
  ]);

  const [taskGroup, setTaskGroup] = React.useState<any>([1]);

  return (
    <EvaluationTable />
  );

  return (
    <div className="mt-4 flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Értékelő</h2>
      <p>
        Kérem válassza ki a feladatot, amelyhez az értékelőt szeretné
        létrehozni.
      </p>

      <Tabs defaultValue={tasks && tasks[0].id}>
        <TabsList>
          {tasks.map((task: Task) => (
            <TabsTrigger key={task.id} value={task.id}>
              {task.name}
            </TabsTrigger>
          ))}
          <AddTaskDialog stageId={stageId} />
        </TabsList>
        {tasks.map((task: Task) => (
          <TabsContent key={task.id} value={task.id} className="w-full">
            <div className="p-4 rounded-lg w-full">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold">{task.name}</h3>

                <Button
                  variant={"default"}
                  onClick={() => setTaskGroup([...taskGroup, task.id])}
                >
                  <PlusIcon size={24} />
                  Új feladatcsoport
                </Button>
              </div>

              {taskGroup.map((group: any, index: number) => (
                <TaskGroup key={`${group}-${index}`} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default EvaluatorBuilder;

const TaskGroup = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tasks, setTasks] = React.useState<any>([]);

  return (
    <div className="flex items-center gap-4 bg-background px-4 py-1 rounded-lg mt-6">
      <div>
        <GripVerticalIcon size={24} />
      </div>
      <div className="w-full">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center gap-4 my-2 w-full">
            <div className="flex items-center gap-2 w-full">
                <div className="flex items-center gap-1 w-fit text-sm border rounded-sm border-black bg-neutral-200 dark:border-white dark:bg-neutral-800  px-2 py-1">
                    <span>10</span>
                    <span> pont</span>
                </div>
                <Input placeholder="A" className="text-lg font-bold w-16 text-center" />
                <Input placeholder="Feladatcsoport neve" className="text-lg font-bold w-full" />
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost">
                <ChevronsUpDownIcon size={24} />
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="mt-4 w-full border-t border-neutral-200 dark:border-neutral-800">

            <div className="flex items-center justify-between gap-4 my-4">
                <h4 className="text-lg font-semibold">Feladatok</h4>
                <span className="text-sm border rounded-sm border-black bg-neutral-200 dark:border-white dark:bg-neutral-800  px-2 py-1">
                    10 pont
                </span>
                <Button size="sm" variant="default" className="" onClick={() => setTasks([...tasks, { id: "1" }])}>
                    <PlusIcon /> Új feladat
                </Button>
            </div>

            <div className="flex flex-col gap-4">
                {tasks.map((task: Task, index: number) => (
                    <Task key={`${task.id}-${index}`} />
                ))}
            </div>
            

          
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

const Task = () => {
    return (
        <div className="flex items-center gap-4 bg-background px-4 py-1 rounded-lg">
            <Input placeholder="Feladat neve" className="text-lg font-medium w-full" />
            <Input placeholder="Pont" className="text-lg font-bold w-16 text-center" defaultValue={1} />
        </div>
    );

};