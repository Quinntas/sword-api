import {z} from "zod";
import {TaskStatus} from "../../repo/task.schema";

export const getTaskQueryString = z.object({
    pid: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    createdAtIni: z.string().optional(),
    createdAtEnd: z.string().optional(),
    technicianPid: z.string().optional(),
    limit: z.string().optional(),
    offset: z.string().optional(),
})

export const getTaskResponse = z.object({
    meta: z.object({
        total: z.number()
    }),
    data: z.array(z.any())
})