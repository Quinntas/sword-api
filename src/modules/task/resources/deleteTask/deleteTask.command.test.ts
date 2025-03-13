import {beforeEach, describe, expect, it, vi} from 'vitest'
import {DeleteTaskCommand} from './deleteTask.command'
import {UserRole} from '../../../user/repo/user.schema'

describe('DeleteTaskCommand', () => {
    let getTaskWithPidRepository: any
    let deleteTaskRepository: any
    let command: DeleteTaskCommand

    beforeEach(() => {
        getTaskWithPidRepository = vi.fn()
        deleteTaskRepository = vi.fn()
        command = new DeleteTaskCommand(getTaskWithPidRepository, deleteTaskRepository)
    })

    it('should delete task successfully when user is manager', async () => {
        // Arrange
        const taskPid = 'task-123'
        const dto = {
            taskPid,
            user: {
                id: 456,
                role: UserRole.MANAGER,
                username: 'manager@example.com',
                password: '<PASSWORD>',
                createdAt: new Date(),
                pid: 'user-123'
            }
        }

        getTaskWithPidRepository.mockResolvedValue([{
            id: 1,
            summary: 'Task to delete',
            technicianId: 789
        }])

        // Act
        await command.handle(dto)

        // Assert
        expect(getTaskWithPidRepository).toHaveBeenCalledWith(taskPid)
        expect(deleteTaskRepository).toHaveBeenCalledWith(taskPid)
        expect(deleteTaskRepository).toHaveBeenCalledTimes(1)
    })

    it('should throw error when user is not a manager', async () => {
        // Arrange
        const dto = {
            taskPid: 'task-123',
            user: {
                id: 456,
                role: UserRole.TECHNICIAN,
                username: 'tech@example.com',
                password: '<PASSWORD>',
                createdAt: new Date(),
                pid: 'user-123'
            }
        }

        // Act & Assert
        await expect(command.handle(dto)).rejects.toThrow('Manager only')
        expect(getTaskWithPidRepository).not.toHaveBeenCalled()
        expect(deleteTaskRepository).not.toHaveBeenCalled()
    })

    it('should throw error when task is not found', async () => {
        // Arrange
        const dto = {
            taskPid: 'non-existent-task',
            user: {
                id: 456,
                role: UserRole.MANAGER,
                username: 'manager@example.com',
                password: '<PASSWORD>',
                createdAt: new Date(),
                pid: 'user-123'
            }
        }

        getTaskWithPidRepository.mockResolvedValue([])

        // Act & Assert
        await expect(command.handle(dto)).rejects.toThrow('Task not found')
        expect(getTaskWithPidRepository).toHaveBeenCalledWith(dto.taskPid)
        expect(deleteTaskRepository).not.toHaveBeenCalled()
    })

    it('should check for task existence before attempting deletion', async () => {
        // Arrange
        const taskPid = 'task-123'
        const dto = {
            taskPid,
            user: {
                id: 456,
                role: UserRole.MANAGER,
                username: 'manager@example.com',
                password: '<PASSWORD>',
                createdAt: new Date(),
                pid: 'user-123'
            }
        }

        getTaskWithPidRepository.mockResolvedValue([{
            id: 1,
            summary: 'Task to delete',
            technicianId: 789
        }])

        // Act
        await command.handle(dto)

        // Assert
        expect(getTaskWithPidRepository).toHaveBeenCalledWith(taskPid)
        expect(getTaskWithPidRepository).toHaveBeenCalledBefore(deleteTaskRepository)
    })
})