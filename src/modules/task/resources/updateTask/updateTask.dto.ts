import {z} from "zod";

export const updateTaskBody = z.object({
    summary: z.string().optional(),
    done: z.boolean().optional(),
})