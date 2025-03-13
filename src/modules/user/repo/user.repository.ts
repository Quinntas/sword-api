import {UserInsertModel, userSchema} from "./user.schema";
import {db} from "../../../start/database";
import {eq} from "drizzle-orm";

export namespace UserRepository {
    export function createUser(insertModel: UserInsertModel) {
        return db.insert(userSchema).values(insertModel).$returningId();
    }

    export function getUserWithUsername(username: string) {
        return db.select().from(userSchema).where(eq(userSchema.username, username))
    }

    export function getUserWithPid(pid: string) {
        return db.select().from(userSchema).where(eq(userSchema.pid, pid))
    }
}