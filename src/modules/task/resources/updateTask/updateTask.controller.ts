import {z} from "zod";
import {controller} from "../../../../core/controller";
import {updateTaskCommand} from "./index";
import {
    ensureAuthenticatedMiddleware
} from "../../../user/resources/ensureAuthenticated/ensureAuthenticated.middleware";
import {updateTaskBody} from "./updateTask.dto";

export const updateTaskController = controller(
    {
        description: "Update task",
        tags: ["Tasks"],
        headers: z.object({
            authorization: z.string(),
        }),
        body: updateTaskBody,
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

        await updateTaskCommand.handle({
            ...request.body,
            taskPid: taskPid,
            user
        })

        return reply.status(200).send({
            message: "Task updated",
        })
    },
    ensureAuthenticatedMiddleware
)
