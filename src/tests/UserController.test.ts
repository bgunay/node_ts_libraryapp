import { NextFunction, Request, Response } from 'express'
import { AppDataSource } from '@database/data-source'
import { UserController } from '@/controllers/UserController'
import { UserEntity } from '@database/entities/user.entity'
import { ResponseUtil } from '@/utils/Response'

jest.mock('@database/data-source')
jest.mock('@/utils/Response')

describe('UserController', () => {
    let mockRequest: Partial<Request>
    let mockResponse: Partial<Response>

    beforeEach(() => {
        mockRequest = {}
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        }
    })

    it('should create a new user and return a response object', async () => {
        mockRequest.body = { name: 'John Doe' }

        const mockUserEntity = new UserEntity()
        mockUserEntity.name = 'John Doe'
        mockUserEntity.borrows = []

        const mockRepo = {
            create: jest.fn().mockReturnValue(mockUserEntity),
            save: jest.fn().mockResolvedValue(mockUserEntity),
        }

        AppDataSource.getRepository = jest.fn().mockReturnValue(mockRepo)

        ResponseUtil.sendResponse = jest.fn().mockImplementation((res, message, data) =>
            res.status(200).json({
                success: true,
                message,
                data,
            })
        )

        // Initialize and invoke UserController
        const userController = new UserController()
        await userController.create(mockRequest as Request, mockResponse as Response, () => {})

        // Assertions
        expect(mockRepo.create).toHaveBeenCalledWith(expect.anything())
        expect(mockRepo.save).toHaveBeenCalledWith(mockUserEntity)
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'Successfully registered',
            data: mockUserEntity,
        })
    })

    it('should retrieve a user by ID and return a response with status code 200', async () => {
        // Arrange
        const mockRequest: Partial<Request> = {
            params: { id: '123' },
        }
        const user = {
            id: '123',
            name: 'John Doe',
            borrows: [],
        }

        const mockRepo = {
            findOne: jest.fn().mockResolvedValue(user),
        }

        AppDataSource.getRepository = jest.fn().mockReturnValue(mockRepo)
        ResponseUtil.sendResponse = jest.fn().mockImplementation((res, message, data) =>
            res.status(200).json({
                success: true,
                message,
                data,
            })
        )

        // Initialize and invoke UserController
        const userController = new UserController()
        await userController.getById(mockRequest as Request, mockResponse as Response, () => {})

        // Assertions
        expect(mockRepo.findOne).toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(200)

        let expectedResponse = {
            data: {
                currentBorrows: [],
                id: '123',
                name: 'John Doe',
                pastBorrows: [],
            },
            message: 'Successfully retrieved user',
            success: true,
        }
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse)
    })
})
