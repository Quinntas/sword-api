import {z} from "zod";

export const createUserBody = z.object({
    username: z.string(),
    password: z.string()
})