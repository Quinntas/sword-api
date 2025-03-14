import {z} from "zod";
import {controller} from "../../../../core/controller";
import {getTaskCommand} from "./index";
import {
    ensureAuthenticatedMiddleware
} from "../../../user/resources/ensureAuthenticated/ensureAuthenticated.middleware";
import {getTaskQueryString, getTaskResponse} from "./getTask.dto";

export const getTaskController = controller(
    {
        description: "Get task",
        tags: ["Tasks"],
        querystring: getTaskQueryString,
        headers: z.object({
            authorization: z.string(),
        }),
        response: {
            200: getTaskResponse,
        }
    },
    async (request, reply) => {
        const user = request.requestContext.get("user")

        if (!user)
            throw new Error("User not found")

        const res = await getTaskCommand.handle({
            filters: request.query,
            user
        })

        return reply.status(200).send(res)
    },
    ensureAuthenticatedMiddleware
)
