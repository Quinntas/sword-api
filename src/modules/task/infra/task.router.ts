import {FastifyTypedInstance} from "../../../core/types";
import {post} from "../../../core/methods";
import {createTaskController} from "../resources/createTask/createTask.controller";

export function taskRouter(app: FastifyTypedInstance) {
    post(app, "/tasks", createTaskController);
}