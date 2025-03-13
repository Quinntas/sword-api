import {CreateTaskCommand} from "./createTask.command";
import {TaskRepository} from "../../repo/task.repository";

export const createTaskCommand = new CreateTaskCommand(TaskRepository.createTask)