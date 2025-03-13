import {UpdateTaskCommand} from "./updateTask.command";
import {TaskRepository} from "../../repo/task.repository";

export const updateTaskCommand = new UpdateTaskCommand(
    TaskRepository.updateTask,
    TaskRepository.getTaskWithPid
)