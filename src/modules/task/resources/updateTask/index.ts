import {UpdateTaskCommand} from "./updateTask.command";
import {TaskRepository} from "../../repo/task.repository";
import {onTaskCompleteEvent} from "../onTaskComplete";

export const updateTaskCommand = new UpdateTaskCommand(
    TaskRepository.updateTask,
    TaskRepository.getTaskWithPid,
    onTaskCompleteEvent
)