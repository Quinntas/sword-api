import {baseColumns} from "../../shared/infra/baseColumns";
import {InferInsertModel, InferSelectModel} from "drizzle-orm";
import {mysqlTable, varchar} from "drizzle-orm/mysql-core";

export enum UserRole {
    MANAGER = "MANAGER",
    TECHNICIAN = "TECHNICIAN",
}

export const userSchema = mysqlTable("users", {
    ...baseColumns(),
    username: varchar({length: 255}).notNull().unique(),
    password: varchar({length: 255}).notNull(),
    role: varchar({length: 255}).notNull().$type<UserRole>(),
})

export type UserSelectModel = InferSelectModel<typeof userSchema>

export type UserInsertModel = InferInsertModel<typeof userSchema>