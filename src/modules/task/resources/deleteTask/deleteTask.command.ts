import {Command} from "../../../../contracts/command";
import {UserRole, UserSelectModel} from "../../../user/repo/user.schema";
import {TaskRepository} from "../../repo/task.repository";

type UpdateTaskCommandDTO = {
    user: UserSelectModel
    taskPid: string
}

export class DeleteTaskCommand implements Command<UpdateTaskCommandDTO, void> {
    constructor(
        private readonly getTaskWithPidRepository: typeof TaskRepository.getTaskWithPid,
        private readonly deleteTaskRepository: typeof TaskRepository.deleteTask,
    ) {
    }

    async handle(dto: UpdateTaskCommandDTO) {
        if (dto.user.role !== UserRole.MANAGER)
            throw new Error('Manager only')

        const [task] = await this.getTaskWithPidRepository(dto.taskPid)

        if (!task)
            throw new Error('Task not found')

        await this.deleteTaskRepository(dto.taskPid)
    }
}