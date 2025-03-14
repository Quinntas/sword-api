import {z} from "zod";
import {Command} from "../../../../contracts/command";
import {updateTaskBody} from "./updateTask.dto";
import {UserRole, UserSelectModel} from "../../../user/repo/user.schema";
import {TaskRepository} from "../../repo/task.repository";
import {TaskStatus} from "../../repo/task.schema";
import {OnTaskCompleteEvent} from "../onTaskComplete/onTaskComplete.event";

type UpdateTaskCommandDTO = z.infer<typeof updateTaskBody> & {
    user: UserSelectModel
    taskPid: string
}

export class UpdateTaskCommand implements Command<UpdateTaskCommandDTO, void> {
    constructor(
        private readonly updateTaskRepository: typeof TaskRepository.updateTask,
        private readonly getTaskWithPidRepository: typeof TaskRepository.getTaskWithPid,
        private readonly onTaskCompleteEvent: OnTaskCompleteEvent,
    ) {
    }

    async handle(dto: UpdateTaskCommandDTO) {
        const [task] = await this.getTaskWithPidRepository(dto.taskPid)

        if (!task)
            throw new Error('Task not found')

        if (dto.user.role === UserRole.TECHNICIAN && task.technicianId !== dto.user.id)
            throw new Error('Task not assigned to you')


        await this.updateTaskRepository(dto.taskPid, {
            summary: dto.summary,
            completedAt: dto.done ? new Date() : undefined,
            status: dto.done ? TaskStatus.COMPLETED : undefined,
        })

        if (dto.done)
            await this.onTaskCompleteEvent.publish({
                date: new Date().toISOString(),
                taskPid: dto.taskPid,
                technicianPid: dto.user.pid
            })
    }
}