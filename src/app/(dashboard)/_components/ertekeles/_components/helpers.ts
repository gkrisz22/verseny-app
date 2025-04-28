export interface TaskWithIdentifier extends Task {
    identifier: string
    level: number
}

type TaskType = "NUMERIC" | "BINARY";

export interface Task {
  id: string
  title: string
  type: TaskType
  points: number
  parentId: string | null
}

export interface TaskGroup {
  id: string
  title: string
  stageId: string
  tasks: Task[]
}

export interface Student {
  id: string
  name: string
}

export interface Evaluation {
  taskId: string
  studentId: string
  value: number
}

export function generateTaskIdentifiers(tasks: Task[]): TaskWithIdentifier[] {
    const result: TaskWithIdentifier[] = [];
    const taskMap: Record<string, TaskWithIdentifier> = {};

    const PREFIX_POOL = ["CAPITALS", "numbers", "small"];

    // Initialize taskMap
    tasks.forEach(task => {
        taskMap[task.id] = { ...task, identifier: "", level: 0 };
    });

    function formatPart(index: number, level: number): string {
        const type = PREFIX_POOL[level % PREFIX_POOL.length];

        if (type === "CAPITALS") {
            return String.fromCharCode(65 + index); // A, B, C...
        } else if (type === "numbers") {
            return (index + 1).toString(); // 1, 2, 3...
        } else if (type === "small") {
            return String.fromCharCode(97 + index); // a, b, c...
        } else {
            return (index + 1).toString();
        }
    }

    function assignIdentifiers(parentId: string | null, prefix: string, level: number) {
        const siblings = tasks
            .filter(task => task.parentId === parentId)
            .sort((a, b) => a.id.localeCompare(b.id));

        siblings.forEach((task, index) => {
            const currentTask = taskMap[task.id];
            const part = formatPart(index, level);

            currentTask.identifier = prefix ? `${prefix}.${part}` : part;
            currentTask.level = level;
            result.push(currentTask);

            assignIdentifiers(task.id, currentTask.identifier, level + 1);
        });
    }

    assignIdentifiers(null, "", 0);

    return result.sort((a, b) => a.identifier.localeCompare(b.identifier));
}



export function calculateTotalPoints(tasks: Task[]): number {
    const taskMap: Record<string, boolean> = {}
    let total = 0

    tasks.forEach((task) => {
        if (!taskMap[task.id]) {
            taskMap[task.id] = true
            total += task.points
        }
    })

    return total
}