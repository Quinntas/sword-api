import {z} from "zod";

export const createTaskBody = z.object({
    summary: z.string(),
})