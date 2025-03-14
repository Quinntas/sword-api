import {OnTaskCompleteEvent} from "./onTaskComplete.event";
import {eventEmitter} from "../../../../start/eventEmitter";

export const onTaskCompleteEvent = new OnTaskCompleteEvent(
    eventEmitter,
)