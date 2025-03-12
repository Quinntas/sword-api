import {z} from "zod";
import {Command} from "../../../../contracts/command";
import {loginBody, loginResponse} from "./login.dto";
import {JWT} from "../../../../utils/jwt";
import {UserRepository} from "../../repo/user.repository";
import {Crypto} from "../../../../utils/crypto";

type LoginCommandDTO = z.infer<typeof loginBody>
type LoginCommandResponseDTO = z.infer<typeof loginResponse>

export class LoginCommand implements Command<LoginCommandDTO, LoginCommandResponseDTO> {
    constructor(
        private readonly getUserRepository: typeof UserRepository.getUserWithUsername
    ) {
    }

    async handle(dto: LoginCommandDTO) {
        const [user] = await this.getUserRepository(dto.username)

        if (!user)
            throw new Error('User not found')

        if (!Crypto.compareEncryptedData(user.password, dto.password, process.env.PEPPER!))
            throw new Error('Invalid password')

        const expiresIn = 3600 // 1 hour
        const expiresAt = new Date(Date.now() + expiresIn).toISOString()

        const jwtToken = JWT.sign(user, process.env.JWT_SECRET!, {expiresIn})

        return {
            token: jwtToken,
            expiresIn,
            expiresAt
        }
    }
}