import {FastifyTypedInstance} from "../../../core/types";
import {post, put} from "../../../core/methods";
import {createTaskController} from "../resources/createTask/createTask.controller";
import {updateTaskController} from "../resources/updateTask/updateTask.controller";

export function taskRouter(app: FastifyTypedInstance) {
    post(app, "/tasks", createTaskController);
    put(app, "/tasks/:taskPid", updateTaskController);
}