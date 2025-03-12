import {LoginCommand} from "./login.command";
import {UserRepository} from "../../repo/user.repository";

export const loginCommand = new LoginCommand(UserRepository.getUserWithUsername)