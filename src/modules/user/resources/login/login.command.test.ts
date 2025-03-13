import {LoginCommand} from './login.command';
import {loginBody} from './login.dto';
import {z} from 'zod';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {JWT} from '../../../../utils/jwt';
import {Crypto} from '../../../../utils/crypto';

vi.mock('../../../../utils/jwt', () => ({
    JWT: {
        sign: vi.fn().mockReturnValue('mock-jwt-token')
    }
}));

vi.mock('../../../../utils/crypto', () => ({
    Crypto: {
        compareEncryptedData: vi.fn()
    }
}));

describe('LoginCommand', () => {
    let command: LoginCommand;
    const getUserRepository = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        command = new LoginCommand(getUserRepository);
        process.env.PEPPER = 'test-pepper';
        process.env.JWT_SECRET = 'test-secret';
    });

    describe('handle', () => {
        const mockUser = {
            id: 1,
            username: 'testuser',
            password: 'hashed-password'
        };

        const loginDto: z.infer<typeof loginBody> = {
            username: 'testuser',
            password: 'password123'
        };

        it('should successfully authenticate user and return token', async () => {
            // Arrange
            getUserRepository.mockResolvedValue([mockUser]);
            vi.mocked(Crypto.compareEncryptedData).mockReturnValue(true);

            // Act
            const result = await command.handle(loginDto);

            // Assert
            expect(result).toEqual({
                token: 'mock-jwt-token',
                expiresIn: 3600,
                expiresAt: expect.any(String)
            });
            expect(getUserRepository).toHaveBeenCalledWith(loginDto.username);
            expect(Crypto.compareEncryptedData).toHaveBeenCalledWith(
                mockUser.password,
                loginDto.password,
                'test-pepper'
            );
            expect(JWT.sign).toHaveBeenCalledWith(
                mockUser,
                'test-secret',
                {expiresIn: 3600}
            );
        });

        it('should throw error when user is not found', async () => {
            // Arrange
            getUserRepository.mockResolvedValue([]);

            // Act & Assert
            await expect(command.handle(loginDto)).rejects.toThrow('User not found');
            expect(getUserRepository).toHaveBeenCalledWith(loginDto.username);
        });

        it('should throw error when password is invalid', async () => {
            // Arrange
            getUserRepository.mockResolvedValue([mockUser]);
            vi.mocked(Crypto.compareEncryptedData).mockReturnValue(false);

            // Act & Assert
            await expect(command.handle(loginDto)).rejects.toThrow('Invalid password');
            expect(getUserRepository).toHaveBeenCalledWith(loginDto.username);
            expect(Crypto.compareEncryptedData).toHaveBeenCalledWith(
                mockUser.password,
                loginDto.password,
                'test-pepper'
            );
        });
    });
});