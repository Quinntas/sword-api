import {z} from "zod";
import {controller} from "../../../../core/controller";
import {createUserBody} from "./createUser.dto";

export const createUserController = controller(
    {
        description: "Create user",
        tags: ["Users"],
        body: createUserBody,
        response: {
            201: z.object({
                message: z.string(),
            }),
        }
    },
    async (request, reply) => {
        const body = request.body

        console.log(body)

        return reply.status(201).send({
            message: "User Created",
        })
    }
)
