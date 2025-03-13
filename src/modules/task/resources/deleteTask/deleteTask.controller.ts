import {z} from "zod";
import {controller} from "../../../../core/controller";
import {deleteTaskCommand} from "./index";
import {
    ensureAuthenticatedMiddleware
} from "../../../user/resources/ensureAuthenticated/ensureAuthenticated.middleware";

export const deleteTaskController = controller(
    {
        description: "Delete task",
        tags: ["Tasks"],
        headers: z.object({
            authorization: z.string(),
        }),
        params: z.object({
            taskPid: z.string(),
        }),
        response: {
            200: z.object({
                message: z.string(),
            }),
        }
    },
    async (request, reply) => {
        const user = request.requestContext.get("user")

        if (!user)
            throw new Error("User not found")

        const {taskPid} = request.params

        await deleteTaskCommand.handle({
            taskPid,
            user
        })

        return reply.status(200).send({
            message: "Task deleted",
        })
    },
    ensureAuthenticatedMiddleware
)
