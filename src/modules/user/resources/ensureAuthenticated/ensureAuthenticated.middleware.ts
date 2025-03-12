import {FastifyRequest} from "fastify";
import {JWT} from "../../../../utils/jwt";
import {UserSelectModel} from "../../repo/user.schema";

export async function ensureAuthenticatedMiddleware(
    request: FastifyRequest,
) {
    const token = request.headers.authorization

    if (!token)
        throw new Error('No token provided')

    const bearer = token?.split(' ')

    if (bearer.length !== 2)
        throw new Error('Invalid token')

    if (bearer[0] !== 'Bearer')
        throw new Error('Invalid token')

    if (!bearer[1])
        throw new Error('Invalid token')

    const bearerToken = bearer[1]

    try {
        const userPayload = JWT.decode<UserSelectModel>(bearerToken, process.env.JWT_SECRET!)

        request.requestContext.set('user', userPayload)
    } catch {
        throw new Error('Invalid token')
    }
}