import {FastifyTypedInstance} from "../../../core/types";
import {del, post, put} from "../../../core/methods";
import {createTaskController} from "../resources/createTask/createTask.controller";
import {updateTaskController} from "../resources/updateTask/updateTask.controller";
import {deleteTaskController} from "../resources/deleteTask/deleteTask.controller";

export function taskRouter(app: FastifyTypedInstance) {
    post(app, "/tasks", createTaskController);
    put(app, "/tasks/:taskPid", updateTaskController);
    del(app, "/tasks/:taskPid", deleteTaskController);
}