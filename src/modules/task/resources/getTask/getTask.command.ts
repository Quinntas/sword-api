import {Command} from "../../../../contracts/command";
import {UserRole, UserSelectModel} from "../../../user/repo/user.schema";
import {TaskRepository} from "../../repo/task.repository";
import {z} from "zod";
import {getTaskQueryString, getTaskResponse} from "./getTask.dto";
import {UserRepository} from "../../../user/repo/user.repository";

type GetTaskCommandDTO = {
    filters: z.infer<typeof getTaskQueryString>;
    user: UserSelectModel
}

type GetTaskCommandResponseDTO = z.infer<typeof getTaskResponse>

export class GetTaskCommand implements Command<GetTaskCommandDTO, GetTaskCommandResponseDTO> {
    constructor(
        private readonly getTasksRepository: typeof TaskRepository.getTasks,
        private readonly getUserWithPidRepository: typeof UserRepository.getUserWithPid
    ) {
    }

    async handle(dto: GetTaskCommandDTO) {
        let technicianId: number | undefined = undefined

        switch (dto.user.role) {
            case UserRole.TECHNICIAN:
                technicianId = dto.user.id
                break
            case UserRole.MANAGER:
                if (dto.filters.technicianPid) {
                    const [user] = await this.getUserWithPidRepository(dto.filters.technicianPid)

                    if (!user)
                        throw new Error("User not found")

                    technicianId = user.id
                }
                break
        }

        const {dataQuery, totalQuery} = this.getTasksRepository(
            {
                pid: dto.filters.pid,
                status: dto.filters.status,
                createdAtIni: dto.filters.createdAtIni ? new Date(dto.filters.createdAtIni) : undefined,
                createdAtEnd: dto.filters.createdAtEnd ? new Date(dto.filters.createdAtEnd) : undefined,
                technicianId
            },
            dto.filters.limit ? parseInt(dto.filters.limit) : undefined,
            dto.filters.offset ? parseInt(dto.filters.offset) : undefined,
        )

        const res = await Promise.all([dataQuery, totalQuery])

        const total = res[1][0].count

        return {
            meta: {
                total,
            },
            data: res[0]
        }
    }
}