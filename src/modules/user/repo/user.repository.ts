import {UserInsertModel, userSchema} from "./user.schema";
import {db} from "../../../start/database";

export namespace UserRepository {
    export function createUser(insertModel: UserInsertModel) {
        return db.insert(userSchema).values(insertModel).$returningId();
    }
}