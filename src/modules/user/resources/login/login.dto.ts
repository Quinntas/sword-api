import {z} from "zod";

export const loginBody = z.object({
    username: z.string(),
    password: z.string()
})

export const loginResponse = z.object({
    token: z.string(),
    expiresIn: z.number(),
    expiresAt: z.string(),
})