import {FastifyTypedInstance} from "../../../core/types";
import {post} from "../../../core/methods";
import {createUserController} from "../resources/createUser/createUser.controller";

export function userRouter(app: FastifyTypedInstance) {
    post(app, "/users", createUserController);
}