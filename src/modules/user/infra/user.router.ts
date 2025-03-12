import {FastifyTypedInstance} from "../../../core/types";
import {post} from "../../../core/methods";
import {createUserController} from "../resources/createUser/createUser.controller";
import {loginController} from "../resources/login/login.controller";

export function userRouter(app: FastifyTypedInstance) {
    post(app, "/users", createUserController);
    post(app, "/login", loginController);
}