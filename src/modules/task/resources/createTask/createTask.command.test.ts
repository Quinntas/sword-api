import {beforeEach, describe, expect, it, vi} from 'vitest'
import {CreateTaskCommand} from './createTask.command'
import {TaskStatus} from '../../repo/task.schema'
import {UserRole} from '../../../user/repo/user.schema'

describe('CreateTaskCommand', () => {
    let createTaskRepository: any
    let command: CreateTaskCommand

    beforeEach(() => {
        createTaskRepository = vi.fn()
        command = new CreateTaskCommand(createTaskRepository)
    })

    it('should create a task successfully for a technician', async () => {
        // Arrange
        const dto = {
            summary: 'Test task',
            user: {
                id: 123,
                role: UserRole.TECHNICIAN,
                username: 'manager@example.com',
                password: '<PASSWORD>',
                createdAt: new Date(),
                pid: "aaa"
            }
        }

        // Act
        await command.handle(dto)

        // Assert
        expect(createTaskRepository).toHaveBeenCalledWith({
            technicianId: dto.user.id,
            summary: dto.summary,
            status: TaskStatus.PENDING
        })
        expect(createTaskRepository).toHaveBeenCalledTimes(1)
    })

    it('should throw error when manager tries to create task', async () => {
        // Arrange
        const dto = {
            summary: 'Test task',
            user: {
                id: 123,
                role: UserRole.MANAGER,
                username: 'manager@example.com',
                password: '<PASSWORD>',
                createdAt: new Date(),
                pid: "aaa"
            }
        }

        // Act & Assert
        await expect(command.handle(dto)).rejects.toThrow('Manager cannot create task')
        expect(createTaskRepository).not.toHaveBeenCalled()
    })

    it('should pass correct task status when creating task', async () => {
        // Arrange
        const dto = {
            summary: 'Test task',
            user: {
                id: 123,
                role: UserRole.TECHNICIAN,
                username: 'manager@example.com',
                password: '<PASSWORD>',
                createdAt: new Date(),
                pid: "aaa"
            }
        }

        // Act
        await command.handle(dto)

        // Assert
        expect(createTaskRepository).toHaveBeenCalledWith(
            expect.objectContaining({
                status: TaskStatus.PENDING
            })
        )
    })
})