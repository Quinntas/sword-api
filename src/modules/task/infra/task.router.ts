import {FastifyTypedInstance} from "../../../core/types";
import {del, get, post, put} from "../../../core/methods";
import {createTaskController} from "../resources/createTask/createTask.controller";
import {updateTaskController} from "../resources/updateTask/updateTask.controller";
import {deleteTaskController} from "../resources/deleteTask/deleteTask.controller";
import {getTaskController} from "../resources/getTask/getTask.controller";

export function taskRouter(app: FastifyTypedInstance) {
    post(app, "/tasks", createTaskController);
    put(app, "/tasks/:taskPid", updateTaskController);
    del(app, "/tasks/:taskPid", deleteTaskController);
    get(app, "/tasks", getTaskController);
}