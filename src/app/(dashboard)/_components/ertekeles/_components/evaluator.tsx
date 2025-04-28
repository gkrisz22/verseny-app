"use client";

import { useReducer, useEffect, useRef, startTransition, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2Icon, Maximize2, Minimize2, SaveIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { calculateTotalPoints, Evaluation, generateTaskIdentifiers, TaskGroup, TaskWithIdentifier } from "./helpers";
import { Stage, Student, StudentStage } from "@prisma/client"; 
import { saveEvaluation } from "@/app/_actions/evaluation.action";
import { useActionForm } from "@/hooks/use-action-form";

const initialState = {
  activeTab: "",
  evaluations: [] as Evaluation[],
  isLoading: true,
};

interface State {
  activeTab: string;
  evaluations: Evaluation[];
  isLoading: boolean;
}

type Action =
  | { type: "SET_ACTIVE_TAB"; payload: string }
  | { type: "SET_EVALUATIONS"; payload: Evaluation[] }
  | { type: "SET_LOADING"; payload: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    case "SET_EVALUATIONS":
      return { ...state, evaluations: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export default function StudentEvaluator({ stage, taskGroups, students, initialEvaluations }: { stage: Stage; taskGroups: TaskGroup[], students: (Student & {studentStageId:string})[], initialEvaluations: Evaluation[] } ) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [activeTask, setActiveTask] = useState<TaskWithIdentifier | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const activeTaskRef = useRef<HTMLDivElement>(null);
  const fullScreenContainerRef = useRef<HTMLDivElement>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (taskGroups.length > 0) {
          dispatch({ type: "SET_ACTIVE_TAB", payload: taskGroups[0].id });
        }

        const initEv: Evaluation[] = [];
        taskGroups.forEach((group) => {
          group.tasks.forEach((task) => {
            students.forEach((student) => {
              initEv.push({
                taskId: task.id,
                studentId: student.studentStageId,
                value: 0
              });
            });
          });
        });


        const mergedEvaluations = initEv.map((initEvItem) => {
          const initialEvItem = initialEvaluations.find((e) => e.taskId === initEvItem.taskId && e.studentId === initEvItem.studentId);
          if (initialEvItem) {
            return { ...initEvItem, value: initialEvItem.value };
          }
          return initEvItem;
        });

        dispatch({ type: "SET_EVALUATIONS", payload: mergedEvaluations });
        dispatch({ type: "SET_LOADING", payload: false });
      } catch (error) {
        toast.error("Hiba történt az értékelések betöltése közben!");
        dispatch({ type: "SET_LOADING", payload: false });
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
  }, [taskGroups, students, initialEvaluations]);

  const updateEvaluation = (taskId: string, studentId: string, value: number) => {
    dispatch({
      type: "SET_EVALUATIONS",
      payload: state.evaluations.map((evaluation) =>
        evaluation.taskId === taskId && evaluation.studentId === studentId
          ? { ...evaluation, value }
          : evaluation
      ),
    });
  };

  const getEvaluation = (taskId: string, studentId: string): Evaluation | undefined => {
    return state.evaluations.find((e) => e.taskId === taskId && e.studentId === studentId);
  };

  const calculateStudentScore = (studentId: string, taskGroupId: string): number => {
    const group = taskGroups.find((g) => g.id === taskGroupId);
    if (!group) return 0;

    let score = 0;
    group.tasks.forEach((task) => {
      const evaluation = getEvaluation(task.id, studentId);
      if (evaluation) {
        if (task.type === "NUMERIC" && typeof evaluation.value === "number") {
          score += Math.min(evaluation.value as number, task.points);
        } else if (task.type === "BINARY" && evaluation.value) {
          score += task.points;
        }
      }
    });

    return score;
  };

  const handleSaveEvaluations = async () => {
    try {
      setIsPending(true);
      toast.promise(saveEvaluation({evaluations: state.evaluations}), {
        loading: "Mentés...",
        success: "Értékelések mentve!",
        error: (err) => {
          if (err instanceof Error) {
            return err.message;
          }
          return "Hiba történt az értékelések mentése közben!";
        },
      });
    } catch (error) {
      toast.error("Hiba történt az értékelések mentése közben!");
    } finally {
      setIsPending(false);
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

  if (state.isLoading) {
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

        <Tabs value={state.activeTab} onValueChange={(value) => dispatch({ type: "SET_ACTIVE_TAB", payload: value })} className="w-full">
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
                    "w-full max-w-full overflow-auto relative border rounded-md",
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
                          key={student.studentStageId}
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
                            const evaluation = getEvaluation(task.id, student.studentStageId);

                            return (
                              <td
                                key={`${student.studentStageId}-${task.id}`}
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
                                                updateEvaluation(task.id, student.studentStageId, value || 0);
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
                                          checked={evaluation ? evaluation.value > 0 : false}
                                          onCheckedChange={(_) => {
                                            updateEvaluation(
                                              task.id,
                                              student.studentStageId,
                                              evaluation ? (evaluation.value > 0 ? 0 : task.points) : task.points
                                            );
                                          }}
                                          onFocus={() => handleFocusTask(task)}
                                          onBlur={() => handleFocusTask(null)}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            );
                          })}

                          <td className={cn("p-3 text-center", index % 2 === 0 ? "bg-transparent" : "bg-muted/30")}>
                            <div className="font-bold text-primary">{calculateStudentScore(student.studentStageId, group.id)}</div>
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
            isFullScreen 
              ? "bottom-8 left-8" 
              : "container mx-auto bottom-8 "
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
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center">
              <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
              Mentés...
            </span>
          ) : (  
            <span className="flex items-center">
              <SaveIcon className="h-4 w-4 mr-2" />
              Mentés
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}