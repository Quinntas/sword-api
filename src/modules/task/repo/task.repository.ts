import {TaskInsertModel, taskSchema, TaskSelectModel} from "./task.schema";
import {db} from "../../../start/database";
import {eq} from "drizzle-orm";

export namespace TaskRepository {
    export function createTask(insertModel: TaskInsertModel) {
        return db.insert(taskSchema).values(insertModel).$returningId()
    }

    export function getTaskWithPid(pid: string) {
        return db.select().from(taskSchema).where(eq(taskSchema.pid, pid))
    }

    export function updateTask(pid: string, updateModel: Partial<TaskSelectModel>) {
        return db.update(taskSchema).set(updateModel).where(eq(taskSchema.pid, pid))
    }
}