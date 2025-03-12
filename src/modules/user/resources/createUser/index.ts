import {CreateUserCommand} from "./createUser.command";
import {UserRepository} from "../../repo/user.repository";

export const createUserCommand = new CreateUserCommand(UserRepository.createUser)