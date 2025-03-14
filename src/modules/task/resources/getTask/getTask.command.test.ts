import {beforeEach, describe, expect, it, vi} from 'vitest'
import {GetTaskCommand} from './getTask.command'
import {TaskStatus} from '../../repo/task.schema'
import {UserRole} from '../../../user/repo/user.schema'

describe('GetTaskCommand', () => {
    let getTasksRepository: any
    let getUserWithPidRepository: any
    let command: GetTaskCommand

    beforeEach(() => {
        getTasksRepository = vi.fn().mockReturnValue({
            dataQuery: Promise.resolve([]),
            totalQuery: Promise.resolve([{count: 0}])
        })
        getUserWithPidRepository = vi.fn()
        command = new GetTaskCommand(getTasksRepository, getUserWithPidRepository)
    })

    it('should fetch tasks for technician with automatic filtering by technician ID', async () => {
        // Arrange
        const dto = {
            filters: {},
            user: {
                id: 123,
                role: UserRole.TECHNICIAN,
                username: 'tech@example.com',
                password: '<PASSWORD>',
                createdAt: new Date(),
                pid: 'user-123'
            }
        }

        // Act
        await command.handle(dto)

        // Assert
        expect(getTasksRepository).toHaveBeenCalledWith(
            expect.objectContaining({
                technicianId: 123
            }),
            undefined,
            undefined
        )
    })

    it('should fetch tasks for manager without technician filter', async () => {
        // Arrange
        const dto = {
            filters: {},
            user: {
                id: 1,
                role: UserRole.MANAGER,
                username: 'tech@example.com',
                password: '<PASSWORD>',
                createdAt: new Date(),
                pid: 'user-123'
            }
        }

        // Act
        await command.handle(dto)

        // Assert
        expect(getTasksRepository).toHaveBeenCalledWith(
            expect.not.objectContaining({
                technicianId: expect.any(Number)
            }),
            undefined,
            undefined
        )
    })

    it('should fetch tasks for manager with specific technician filter', async () => {
        // Arrange
        const technicianId = 456
        getUserWithPidRepository.mockResolvedValue([{id: technicianId}])

        const dto = {
            filters: {
                technicianPid: 'tech-123'
            },
            user: {
                id: 1,
                role: UserRole.MANAGER,
                username: 'tech@example.com',
                password: '<PASSWORD>',
                createdAt: new Date(),
                pid: 'user-123'
            }
        }

        // Act
        await command.handle(dto)

        // Assert
        expect(getUserWithPidRepository).toHaveBeenCalledWith('tech-123')
        expect(getTasksRepository).toHaveBeenCalledWith(
            expect.objectContaining({
                technicianId
            }),
            undefined,
            undefined
        )
    })

    it('should throw error when specified technician is not found', async () => {
        // Arrange
        getUserWithPidRepository.mockResolvedValue([])

        const dto = {
            filters: {
                technicianPid: 'non-existent'
            },
            user: {
                id: 1,
                role: UserRole.MANAGER,
                username: 'tech@example.com',
                password: '<PASSWORD>',
                createdAt: new Date(),
                pid: 'user-123'
            }
        }

        // Act & Assert
        await expect(command.handle(dto)).rejects.toThrow('User not found')
    })

    it('should apply pagination parameters correctly', async () => {
        // Arrange
        const dto = {
            filters: {
                limit: '10',
                offset: '20'
            },
            user: {
                id: 1,
                role: UserRole.MANAGER,
                username: 'tech@example.com',
                password: '<PASSWORD>',
                createdAt: new Date(),
                pid: 'user-123'
            }
        }

        // Act
        await command.handle(dto)

        // Assert
        expect(getTasksRepository).toHaveBeenCalledWith(
            expect.any(Object),
            10,
            20
        )
    })

    it('should apply all filter parameters correctly', async () => {
        // Arrange
        const dto = {
            filters: {
                pid: 'task-123',
                status: TaskStatus.PENDING,
                createdAtIni: '2024-01-01',
                createdAtEnd: '2024-12-31'
            },
            user: {
                id: 1,
                role: UserRole.MANAGER,
                username: 'tech@example.com',
                password: '<PASSWORD>',
                createdAt: new Date(),
                pid: 'user-123'
            }
        }

        // Act
        await command.handle(dto)

        // Assert
        expect(getTasksRepository).toHaveBeenCalledWith(
            expect.objectContaining({
                pid: 'task-123',
                status: TaskStatus.PENDING,
                createdAtIni: expect.any(Date),
                createdAtEnd: expect.any(Date)
            }),
            undefined,
            undefined
        )
    })

    it('should return correct response format with meta and data', async () => {
        // Arrange
        const mockTasks = [{id: 1, title: 'Task 1'}]
        const mockTotal = 1

        getTasksRepository.mockReturnValue({
            dataQuery: Promise.resolve(mockTasks),
            totalQuery: Promise.resolve([{count: mockTotal}])
        })

        const dto = {
            filters: {},
            user: {
                id: 1,
                role: UserRole.MANAGER,
                username: 'tech@example.com',
                password: '<PASSWORD>',
                createdAt: new Date(),
                pid: 'user-123'
            }
        }

        // Act
        const result = await command.handle(dto)

        // Assert
        expect(result).toEqual({
            meta: {
                total: mockTotal
            },
            data: mockTasks
        })
    })
})