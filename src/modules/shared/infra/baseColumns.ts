import {randomUUID} from "node:crypto";
import {datetime, serial, varchar} from "drizzle-orm/mysql-core";

export function baseColumns() {
    return {
        id: serial().primaryKey(),
        pid: varchar({length: 255})
            .notNull()
            .unique()
            .$defaultFn(() => randomUUID()),
        createdAt: datetime('created_at', {mode: "date"})
            .notNull()
    };
}
