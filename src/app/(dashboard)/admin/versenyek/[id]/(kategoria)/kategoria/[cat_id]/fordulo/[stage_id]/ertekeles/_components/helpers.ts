
export interface TaskWithIdentifier extends Task {
    identifier: string
    level: number
}

type TaskType = "NUMERIC" | "BINARY" | "TEXT"

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
  value: string | number | boolean | null
  comment?: string
}



export function generateTaskIdentifiers(tasks: Task[]): TaskWithIdentifier[] {
    const result: TaskWithIdentifier[] = []
    const taskMap: Record<string, TaskWithIdentifier> = {}

    tasks.forEach((task) => {
        taskMap[task.id] = {
            ...task,
            identifier: "",
            level: 0,
        }
    })

    tasks.forEach((task) => {
        if (task.parentId === null) {
            taskMap[task.id].level = 0
        } else if (taskMap[task.parentId]) {
            taskMap[task.id].level = taskMap[task.parentId].level + 1
        }
    })

    const rootTasks = tasks.filter((task) => task.parentId === null && task.type !== "TEXT")
    rootTasks.forEach((task, index) => {
        const identifier = String.fromCharCode(65 + index) // A, B, C, ...
        taskMap[task.id].identifier = identifier
        result.push(taskMap[task.id])

        const childTasks = tasks.filter((t) => t.parentId === task.id && t.type !== "TEXT")
        childTasks.forEach((childTask, childIndex) => {
            const childIdentifier = `${identifier}.${childIndex + 1}` // A.1, A.2, ...
            taskMap[childTask.id].identifier = childIdentifier
            result.push(taskMap[childTask.id])

            // Generate identifiers for grandchild tasks
            const grandchildTasks = tasks.filter((t) => t.parentId === childTask.id && t.type !== "TEXT")
            grandchildTasks.forEach((grandchildTask, grandchildIndex) => {
                const grandchildIdentifier = `${childIdentifier}.${String.fromCharCode(97 + grandchildIndex)}` // A.1.a, A.1.b, ...
                taskMap[grandchildTask.id].identifier = grandchildIdentifier
                result.push(taskMap[grandchildTask.id])
            })
        })
    })

    // Filter out TEXT type tasks and sort by identifier
    return result.filter((task) => task.type !== "TEXT").sort((a, b) => a.identifier.localeCompare(b.identifier))
}

export function calculateTotalPoints(tasks: Task[]): number {
    const taskMap: Record<string, boolean> = {}
    let total = 0

    tasks.forEach((task) => {
        if (!taskMap[task.id] && task.type !== "TEXT") {
            taskMap[task.id] = true
            total += task.points
        }
    })

    return total
}