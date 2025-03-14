import {drizzle} from "drizzle-orm/mysql2";

export const db = drizzle(process.env.DATABASE_URL!);

export const pingDatabase = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        db.execute("SELECT 1")
            .then(() => resolve("Database connection is healthy."))
            .catch((error) => reject(`Database ping failed: ${error}`));
    });
};
