import {z} from "zod";
import {controller} from "../../../../core/controller";
import {createTaskBody} from "./createTask.dto";
import {createTaskCommand} from "./index";
import {
    ensureAuthenticatedMiddleware
} from "../../../user/resources/ensureAuthenticated/ensureAuthenticated.middleware";

export const createTaskController = controller(
    {
        description: "Create task",
        tags: ["Tasks"],
        body: createTaskBody,
        headers: z.object({
            authorization: z.string(),
        }),
        response: {
            201: z.object({
                message: z.string(),
            }),
        }
    },
    async (request, reply) => {
        const user = request.requestContext.get("user")

        if (!user)
            throw new Error("User not found")

        await createTaskCommand.handle({
            ...request.body,
            user
        })

        return reply.status(201).send({
            message: "Task Created",
        })
    },
    ensureAuthenticatedMiddleware
)
