import {TaskInsertModel, taskSchema} from "./task.schema";
import {db} from "../../../start/database";

export namespace TaskRepository {
    export function createTask(insertModel: TaskInsertModel) {
        return db.insert(taskSchema).values(insertModel).$returningId()
    }
}