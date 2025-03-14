import {eventEmitter} from "./eventEmitter";
import {onTaskCompleteEvent} from "../modules/task/resources/onTaskComplete";

export async function eventRoutes() {
    await eventEmitter.createQueue(onTaskCompleteEvent.name)
    await eventEmitter.consume(onTaskCompleteEvent.name, onTaskCompleteEvent.handle)
}