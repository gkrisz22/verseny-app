"use client";

import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2Icon, Maximize2, Minimize2, SaveIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { calculateTotalPoints, Evaluation, generateTaskIdentifiers, Student, TaskGroup, TaskWithIdentifier } from "./helpers";
import { Stage } from "@prisma/client"; 
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


const MOCK_STUDENTS: Student[] = Array.from({ length: 15 }, (_, i) => ({
  id: `s${i + 1}`,
  name: `Tanuló ${i + 1}${i === 0 ? " (Hosszú Névvel Tesztelve)" : ""}`,
}));

export default function StudentEvaluator({ stage, taskGroups, isFeluljavito = false }: { stage: Stage; taskGroups: TaskGroup[], isFeluljavito: boolean }) {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [activeTab, setActiveTab] = useState<string>("");
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<TaskWithIdentifier | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const activeTaskRef = useRef<HTMLDivElement>(null);
  const fullScreenContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setStudents((prev) => prev.sort((a, b) => a.name.localeCompare(b.name)));

        if (taskGroups.length > 0 && !activeTab) {
          setActiveTab(taskGroups[0].id);
        }

        const initialEvaluations: Evaluation[] = [];
        taskGroups.forEach((group) => {
          group.tasks.forEach((task) => {
            if (task.type !== "TEXT") {
              students.forEach((student) => {
                initialEvaluations.push({
                  taskId: task.id,
                  studentId: student.id,
                  value: null,
                });
              });
            }
          });
        });
        setEvaluations(initialEvaluations);

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      }
    };

    loadData();

    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const updateEvaluation = (taskId: string, studentId: string, value: string | number | boolean | null) => {
    setEvaluations((prev) => {
      const newEvaluations = [...prev];
      const index = newEvaluations.findIndex((e) => e.taskId === taskId && e.studentId === studentId);

      if (index !== -1) {
        newEvaluations[index] = { ...newEvaluations[index], value };
      } else {
        newEvaluations.push({ taskId, studentId, value });
      }

      return newEvaluations;
    });
  };

  const getEvaluation = (taskId: string, studentId: string): Evaluation | undefined => {
    return evaluations.find((e) => e.taskId === taskId && e.studentId === studentId);
  };

  const calculateStudentScore = (studentId: string, taskGroupId: string): number => {
    const group = taskGroups.find((g) => g.id === taskGroupId);
    if (!group) return 0;

    let score = 0;
    group.tasks.forEach((task) => {
      const evaluation = getEvaluation(task.id, studentId);
      if (evaluation) {
        if (task.type === "NUMERIC" && typeof evaluation.value === "number") {
          score += Math.min(evaluation.value as number, task.points); // Ne legyen több pont, mint az adható maximális
        } else if (task.type === "BINARY" && evaluation.value) {
          score += task.points;
        }
      }
    });

    return score;
  };

  const handleSaveEvaluations = async () => {
    try {

      console.log("Saving evaluations:", evaluations);
      alert("Értékelések sikeresen mentve!");
    } catch (error) {
      console.error("Error saving evaluations:", error);
      alert("Hiba történt az értékelések mentése közben!");
    }
  };

  const handleFocusTask = (task: TaskWithIdentifier | null) => {
    setActiveTask(task);

    if (activeTaskRef.current) {
      if (task) {
        activeTaskRef.current.classList.remove("opacity-0", "translate-y-2");
        activeTaskRef.current.classList.add("opacity-100", "translate-y-0");
      } else {
        activeTaskRef.current.classList.remove("opacity-100", "translate-y-0");
        activeTaskRef.current.classList.add("opacity-0", "translate-y-2");
      }
    }
  };

  const toggleFullScreen = async () => {
    if (!isFullScreen) {
      try {
        if (fullScreenContainerRef.current) {
          await fullScreenContainerRef.current.requestFullscreen();
        }
      } catch (err) {
        toast.error("Nem sikerült a teljes képernyős mód bekapcsolása!");
      }
    } else {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch (err) {
        toast.error("Nem sikerült a teljes képernyős mód kikapcsolása!");
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Betöltés...</div>;
  }

  return (
    <div className="space-y-4 mt-8" ref={fullScreenContainerRef}>
      <div className={cn("transition-all duration-300", isFullScreen ? "p-4 bg-background" : "")}>
        <div className="flex items-center justify-between mb-4">
          <h1 className={cn("font-bold", isFullScreen ? "text-3xl" : "text-2xl")}>Diákok értékelése</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullScreen}
            className="ml-2"
            title={isFullScreen ? "Kilépés a teljes képernyős módból" : "Teljes képernyős mód"}
          >
            {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4 bg-background rounded-lg">
            <TabsList className="overflow-x-auto rounded-lg">
              {taskGroups.map((group) => (
                <TabsTrigger key={group.id} value={group.id} className="flex items-center gap-2">
                  {group.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {taskGroups.map((group) => {
            const tasksWithIdentifiers = generateTaskIdentifiers(group.tasks);

            return (
              <TabsContent key={group.id} value={group.id} className="border rounded-lg p-4 w-full">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">{group.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    Összpontszám: {calculateTotalPoints(group.tasks)} pont
                  </p>
                </div>

                <div
                  className={cn(
                    "w-full max-w-full  overflow-auto relative border rounded-md",
                    isFullScreen ? "h-[calc(100vh-180px)]" : "h-[calc(100vh-300px)]"
                  )}
                >
                  <table className="max-w-full w-full border-collapse mb-8">
                    <thead>
                      <tr>
                        <th className="sticky top-0 left-0 z-30 bg-muted w-fit max-w-[50px] text-left whitespace-nowrap p-3 border-b border-r">
                          Tanuló
                        </th>

                        {tasksWithIdentifiers.map((task) => (
                          <th
                            key={task.id}
                            className="sticky top-0 z-20 bg-muted min-w-[120px] text-center whitespace-nowrap p-3 border-b"
                          >
                            <div className="font-mono font-bold bg-muted-foreground/20 rounded px-2 py-0.5 inline-block mb-1">
                              {task.identifier}
                            </div>
                            <div className="text-sm" title={task.title}>
                              {task.title.length > 15 ? `${task.title.substring(0, 15)}...` : task.title}
                            </div>
                            <div className="font-bold text-primary">{task.points} pont</div>
                            <div className="text-xs bg-muted-foreground/20 rounded px-2 py-0.5 inline-block mt-1">
                              {task.type === "NUMERIC" ? "Pontszám" : "Igen/Nem"}
                            </div>
                          </th>
                        ))}

                        {/* Összpontszám */}
                        <th className="sticky top-0 z-20 bg-muted min-w-[120px] text-center whitespace-nowrap p-3 border-b">
                          <div className="font-mono font-bold bg-muted-foreground/20 rounded px-2 py-0.5 inline-block mb-1">
                            Össz.
                          </div>
                          <div className="font-bold text-primary">{calculateTotalPoints(group.tasks)} pont</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Diákok */}
                      {students.map((student, index) => (
                        <tr
                          key={student.id}
                          className={cn(
                            "hover:bg-accent/10 transition-colors",
                            index % 2 === 0 ? "bg-transparent" : "bg-muted"
                          )}
                        >
                          <td
                            className={cn(
                              "sticky left-0 z-10 border-r-2 p-3 text-left whitespace-nowrap w-fit border-muted",
                              index % 2 === 0 ? "bg-slate-50 dark:bg-slate-950" : "bg-slate-200 dark:bg-slate-700"
                            )}
                          >
                            <div className="font-medium text-sm">{student.name}</div>
                          </td>

                          {tasksWithIdentifiers.map((task) => {
                            const evaluation = getEvaluation(task.id, student.id);

                            return (
                              <td
                                key={`${student.id}-${task.id}`}
                                className={cn(
                                  "p-3 text-center group",
                                  index % 2 === 0 ? "bg-background" : "bg-muted/30"
                                )}
                              >
                                <div className="inline-flex items-center">
                                <div className="group-focus-within:bg-accent/20 rounded-md p-1 transition-colors">
                                  {task.type === "NUMERIC" && (
                                    <Input
                                      type="number"
                                      min="0"
                                      max={task.points}
                                      {...(task.points === 0
                                        ? {
                                          readOnly: true,
                                          value: "0",
                                        }
                                        : {
                                          value:
                                            evaluation?.value !== null && evaluation?.value !== undefined
                                              ? evaluation.value.toString()
                                              : "",
                                          onChange: (e) => {
                                            const value =
                                              e.target.value === ""
                                                ? null
                                                : Math.min(Number(e.target.value), task.points);
                                            updateEvaluation(task.id, student.id, value);
                                          },
                                        })}
                                      onFocus={() => handleFocusTask(task)}
                                      onBlur={() => handleFocusTask(null)}
                                      className="w-16 mx-auto text-center"
                                      placeholder="0"
                                    />
                                  )}

                                  {task.type === "BINARY" && (
                                    <div className="flex justify-center">
                                      <Checkbox
                                        checked={evaluation?.value === true}
                                        onCheckedChange={(checked) => {
                                          updateEvaluation(task.id, student.id, checked === true);
                                        }}
                                        onFocus={() => handleFocusTask(task)}
                                        onBlur={() => handleFocusTask(null)}
                                      />
                                    </div>
                                  )}
                                </div>

                                {
                                  isFeluljavito && (
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          className="p-2"  
                                          size={"icon"}
                                        >
                                          <Edit2Icon size="14" />
                                        </Button>
                                        </PopoverTrigger>
                                      <PopoverContent>Place content for the popover here.</PopoverContent>
                                    </Popover>
                                  )
                                }</div>
                              </td>
                            );
                          })}

                          <td className={cn("p-3 text-center", index % 2 === 0 ? "bg-transparent" : "bg-muted/30")}>
                            <div className="font-bold text-primary">{calculateStudentScore(student.id, group.id)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        <div
          ref={activeTaskRef}
          className={cn(
            "fixed bg-primary text-primary-foreground p-3 rounded-lg shadow-lg z-50 max-w-[300px] opacity-0 translate-y-2 transition-all duration-200 ease-in-out pointer-events-none",
            isFullScreen ? "bottom-8 left-8" : "bottom-20 left-4"
          )}
        >
          {activeTask && (
            <>
              <div className="font-mono font-bold">{activeTask.identifier}</div>
              <div className="font-medium">{activeTask.title}</div>
              <div className="text-sm">{activeTask.points} pont</div>
            </>
          )}
        </div>

        <Button
          onClick={handleSaveEvaluations}
          size={"lg"}
          variant={"default"}
          className={cn("w-fit rounded-full p-4 pt-4 fixed right-4", isFullScreen ? "bottom-8" : "bottom-4")}
        >
          <span className="flex items-center">
            <SaveIcon className="h-4 w-4 mr-2" />
            Mentés
          </span>
        </Button>
      </div>
    </div>
  );
}