import {OnTaskCompleteEvent} from "./onTaskComplete.event";
import {eventEmitter} from "../../../../start/eventEmitter";
import {TaskRepository} from "../../repo/task.repository";
import {UserRepository} from "../../../user/repo/user.repository";

export const onTaskCompleteEvent = new OnTaskCompleteEvent(
    eventEmitter,
    TaskRepository.getTaskWithPid,
    UserRepository.getUserWithPid
)