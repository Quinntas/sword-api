import {CreateUserCommand} from './createUser.command';
import {createUserBody} from './createUser.dto';
import {z} from 'zod';
import {beforeEach, describe, expect, it, vi} from 'vitest';

describe('CreateUserCommand', () => {
    let command: CreateUserCommand;
    const createUserRepository = vi.fn()

    beforeEach(() => {
        command = new CreateUserCommand(createUserRepository);
    });

    describe('handle', () => {
        it('should create a user successfully', async () => {
            const dto: z.infer<typeof createUserBody> = {
                username: "test",
                password: "test",
            };

            const result = await command.handle(dto);

            expect(result).toBe(undefined);
            expect(createUserRepository).toHaveBeenCalled()
        });
    });
});