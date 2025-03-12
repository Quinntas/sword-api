import {z} from "zod";
import {controller} from "../../../../core/controller";
import {loginBody} from "./login.dto";
import {loginCommand} from "./index";

export const loginController = controller(
    {
        description: "Logins user",
        tags: ["Users"],
        body: loginBody,
        response: {
            200: z.object({
                token: z.string(),
                expiresIn: z.number(),
                expiresAt: z.string(),
            }),
        }
    },
    async (request, reply) => {
        const user = request.requestContext.get('user')

        if (!user)
            throw new Error('User not found')

        const res = await loginCommand.handle({
            ...request.body,
            user
        })

        return reply.status(200).send(res)
    },
)
