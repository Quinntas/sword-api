import {GetTaskCommand} from "./getTask.command";
import {TaskRepository} from "../../repo/task.repository";
import {UserRepository} from "../../../user/repo/user.repository";

export const getTaskCommand = new GetTaskCommand(TaskRepository.getTasks, UserRepository.getUserWithPid)