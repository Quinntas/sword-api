import {DeleteTaskCommand} from "./deleteTask.command";
import {TaskRepository} from "../../repo/task.repository";

export const deleteTaskCommand = new DeleteTaskCommand(
    TaskRepository.getTaskWithPid,
    TaskRepository.deleteTask
)