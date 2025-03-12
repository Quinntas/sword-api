import {createUserBody} from "./createUser.dto";
import {Command} from "../../../../core/command";
import {z} from "zod";

export class CreateUserCommand extends Command<z.infer<typeof createUserBody>, void> {
    async handle(dto: z.infer<typeof createUserBody>) {
        
    }
}