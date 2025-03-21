import {randomUUID} from "node:crypto";
import {datetime, int, varchar} from "drizzle-orm/mysql-core";
import {sql} from "drizzle-orm";

// @formatter:off
export function baseColumns() {
    return {
        id: int().primaryKey().autoincrement(),
        pid: varchar({length: 255})
            .notNull()
            .unique()
            .$defaultFn(() => randomUUID()),
        createdAt: datetime('created_at', {mode: "date"})
            .notNull()
            .default(sql`now()`),
    };
}
