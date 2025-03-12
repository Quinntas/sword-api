import {controller} from "../../../../core/controller";
import {loginBody, loginResponse} from "./login.dto";
import {loginCommand} from "./index";

export const loginController = controller(
    {
        description: "Logins user",
        tags: ["Users"],
        body: loginBody,
        response: {
            200: loginResponse,
        }
    },
    async (request, reply) => {
        const res = await loginCommand.handle(request.body)

        return reply.status(200).send(res)
    },
)
