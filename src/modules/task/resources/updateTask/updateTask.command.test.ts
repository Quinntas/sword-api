import {beforeEach, describe, expect, it, vi} from 'vitest'
import {UpdateTaskCommand} from './updateTask.command'
import {TaskStatus} from '../../repo/task.schema'
import {UserRole} from '../../../user/repo/user.schema'
import {OnTaskCompleteEvent} from '../onTaskComplete/onTaskComplete.event'

describe('UpdateTaskCommand', () => {
    let updateTaskRepository: any
    let getTaskWithPidRepository: any
    let onTaskCompleteEvent: OnTaskCompleteEvent
    let command: UpdateTaskCommand

    beforeEach(() => {
        updateTaskRepository = vi.fn()
        getTaskWithPidRepository = vi.fn()
        onTaskCompleteEvent = {
            publish: vi.fn()
        } as unknown as OnTaskCompleteEvent
        command = new UpdateTaskCommand(
            updateTaskRepository,
            getTaskWithPidRepository,
            onTaskCompleteEvent
        )
    })

    it('should update task successfully when user is assigned technician', async () => {
        // Arrange
        const taskPid = 'task-123'
        const userId = 456
        const dto = {
            summary: 'Updated task summary',
            done: false,
            taskPid,
            user: {
                id: userId,
                role: UserRole.TECHNICIAN,
                username: 'tech@example.com',
                password: '<PASSWORD>',
                createdAt: new Date(),
                pid: 'user-123'
            }
        }

        getTaskWithPidRepository.mockResolvedValue([{
            technicianId: userId,
            summary: 'Original summary',
            status: TaskStatus.PENDING
        }])

        // Act
        await command.handle(dto)

        // Assert
        expect(updateTaskRepository).toHaveBeenCalledWith(taskPid, {
            summary: dto.summary,
            completedAt: undefined,
            status: undefined
        })
        expect(updateTaskRepository).toHaveBeenCalledTimes(1)
        expect(onTaskCompleteEvent.publish).not.toHaveBeenCalled()
    })

    it('should update task status to completed and publish event when done is true', async () => {
        // Arrange
        const taskPid = 'task-123'
        const userId = 456
        const userPid = 'user-123'
        const dto = {
            summary: 'Updated task summary',
            done: true,
            taskPid,
            user: {
                id: userId,
                role: UserRole.TECHNICIAN,
                username: 'tech@example.com',
                password: '<PASSWORD>',
                createdAt: new Date(),
                pid: userPid
            }
        }

        getTaskWithPidRepository.mockResolvedValue([{
            technicianId: userId,
            summary: 'Original summary',
            status: TaskStatus.PENDING
        }])

        // Act
        await command.handle(dto)

        // Assert
        expect(updateTaskRepository).toHaveBeenCalledWith(taskPid, {
            summary: dto.summary,
            completedAt: expect.any(Date),
            status: TaskStatus.COMPLETED
        })
        expect(onTaskCompleteEvent.publish).toHaveBeenCalled()
        expect(onTaskCompleteEvent.publish).toHaveBeenCalled()
    })

    it('should throw error when task is not found', async () => {
        // Arrange
        const dto = {
            summary: 'Updated task summary',
            done: false,
            taskPid: 'non-existent-task',
            user: {
                id: 456,
                role: UserRole.TECHNICIAN,
                username: 'tech@example.com',
                password: '<PASSWORD>',
                createdAt: new Date(),
                pid: 'user-123'
            }
        }

        getTaskWithPidRepository.mockResolvedValue([])

        // Act & Assert
        await expect(command.handle(dto)).rejects.toThrow('Task not found')
        expect(updateTaskRepository).not.toHaveBeenCalled()
        expect(onTaskCompleteEvent.publish).not.toHaveBeenCalled()
    })

    it('should throw error when task is not assigned to the user', async () => {
        // Arrange
        const dto = {
            summary: 'Updated task summary',
            done: false,
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

        getTaskWithPidRepository.mockResolvedValue([{
            technicianId: 789, // Different technician ID
            summary: 'Original summary',
            status: TaskStatus.PENDING
        }])

        // Act & Assert
        await expect(command.handle(dto)).rejects.toThrow('Task not assigned to you')
        expect(updateTaskRepository).not.toHaveBeenCalled()
        expect(onTaskCompleteEvent.publish).not.toHaveBeenCalled()
    })
})