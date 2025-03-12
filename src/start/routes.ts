import {FastifyTypedInstance} from "../core/types";
import {sharedRouter} from "../modules/shared/infra/shared.router";
import {userRouter} from "../modules/user/infra/user.router";

export async function routes(app: FastifyTypedInstance) {
    sharedRouter(app)
    userRouter(app)
}
