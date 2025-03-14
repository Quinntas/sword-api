import {Event} from "../../../../contracts/event";
import {EventEmitter} from "../../../../contracts/eventEmitter";
import {OnTaskCompleteDTO} from "./onTaskComplete.dto";

export class OnTaskCompleteEvent extends Event<OnTaskCompleteDTO> {
    constructor(
        eventEmitter: EventEmitter,
    ) {
        super("OnTaskCompleteEvent", eventEmitter);
    }

    async handle(message: string | null) {
        if (!message)
            return

        const json = JSON.parse(message) as OnTaskCompleteDTO

        console.log(`The tech ${json.technicianPid} performed the task ${json.taskPid} on date ${json.date}`)
    }
}