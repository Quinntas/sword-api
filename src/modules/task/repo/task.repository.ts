import {TaskInsertModel, taskSchema, TaskSelectModel, TaskStatus} from "./task.schema";
import {db} from "../../../start/database";
import {and, count, eq, gte, lte} from "drizzle-orm";

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

    export function deleteTask(pid: string) {
        return db.delete(taskSchema).where(eq(taskSchema.pid, pid))
    }

    interface GetTaskFilters {
        pid?: string
        status?: TaskStatus
        createdAtIni?: Date
        createdAtEnd?: Date
        technicianId?: number
    }

    // @formatter:off
    export function getTasks(filters: GetTaskFilters, limit?: number, offset?: number) {
        const where = and(
            filters.pid ? eq(taskSchema.pid, filters.pid) : undefined,
            filters.status ? eq(taskSchema.status, filters.status) : undefined,
            filters.technicianId ? eq(taskSchema.technicianId, filters.technicianId) : undefined,
            filters.createdAtIni ? gte(taskSchema.createdAt, filters.createdAtIni) : undefined,
            filters.createdAtEnd ? lte(taskSchema.createdAt, filters.createdAtEnd) : undefined,
        )

        const dataQuery = db.select().from(taskSchema).where(where)
        const totalQuery = db.select({count: count()}).from(taskSchema).where(where)

        if (limit)
            dataQuery.limit(limit)

        if (offset)
            dataQuery.offset(offset)

        return {
            dataQuery,
            totalQuery
        }
    }
}