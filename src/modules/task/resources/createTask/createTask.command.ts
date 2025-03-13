import {z} from "zod";
import {Command} from "../../../../contracts/command";
import {TaskRepository} from "../../repo/task.repository";
import {createTaskBody} from "./createTask.dto";
import {TaskStatus} from "../../repo/task.schema";
import {UserRole, UserSelectModel} from "../../../user/repo/user.schema";

type CreateTaskCommandDTO = z.infer<typeof createTaskBody> & {
    user: UserSelectModel
}

export class CreateTaskCommand implements Command<CreateTaskCommandDTO, void> {
    constructor(
        private readonly createTaskRepository: typeof TaskRepository.createTask,
    ) {
    }

    async handle(dto: CreateTaskCommandDTO) {
        if (dto.user.role === UserRole.MANAGER)
            throw new Error('Manager cannot create task')

        await this.createTaskRepository({
            technicianId: dto.user.id,
            summary: dto.summary,
            status: TaskStatus.PENDING,
        })
    }
}