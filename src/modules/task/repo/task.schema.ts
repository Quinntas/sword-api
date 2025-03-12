import {baseColumns} from "../../shared/infra/baseColumns";
import {userSchema} from "../../user/repo/user.schema";
import {InferSelectModel} from "drizzle-orm";
import {datetime, int, mysqlTable, varchar} from "drizzle-orm/mysql-core";

export enum TaskStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
}

export const taskSchema = mysqlTable("tasks", {
    ...baseColumns(),
    technicianId: int("technician_id").notNull().references(() => userSchema.id),
    summary: varchar({length: 2500}).notNull(),
    status: varchar({length: 255}).notNull().$type<TaskStatus>(),
    completedAt: datetime('completed_at', {mode: "date"})
})

export type TaskSelectModel = InferSelectModel<typeof taskSchema>

export type TaskInsertModel = InferSelectModel<typeof taskSchema>
