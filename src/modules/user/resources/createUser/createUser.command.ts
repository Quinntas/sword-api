import {createUserBody} from "./createUser.dto";
import {z} from "zod";
import {Command} from "../../../../contracts/command";
import {UserRepository} from "../../repo/user.repository";
import {Crypto} from "../../../../utils/crypto";
import {UserRole} from "../../repo/user.schema";

export class CreateUserCommand implements Command<z.infer<typeof createUserBody>, void> {
    constructor(
        private readonly createUserRepository: typeof UserRepository.createUser
    ) {
    }

    async handle(dto: z.infer<typeof createUserBody>) {
        const password = Crypto.encrypt(dto.password, process.env.PEPPER!)

        await this.createUserRepository({
            username: dto.username,
            password,
            role: UserRole.TECHNICIAN,
        })
    }
}