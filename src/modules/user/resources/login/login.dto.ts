import {z} from "zod";

export const loginBody = z.object({
    username: z.string(),
    password: z.string()
})