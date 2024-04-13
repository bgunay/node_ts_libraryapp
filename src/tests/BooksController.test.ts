import { NextFunction, Request, Response } from 'express'
import { BooksController } from '@/controllers/BooksController'
import { AppDataSource } from '@database/data-source'
import { BookEntity } from '@database/entities/book.entity'
import { ResponseUtil } from '@/utils/Response'
import { ValidationError } from 'class-validator'

jest.mock('@database/data-source')
jest.mock('@/utils/Response')

describe('BooksController', () => {
    let mockRequest: Partial<Request>
    let mockResponse: Partial<Response>
    const nextFunction: NextFunction = jest.fn()

    beforeEach(() => {
        mockRequest = {}
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        }
    })

    it('test_get_all_books_successfully', async () => {
        const books = [
            { id: '1', name: 'Test Book 1' },
            { id: '2', name: 'Test Book 2' },
        ]
        const repo = {
            find: jest.fn().mockResolvedValue(books),
        }
        AppDataSource.getRepository = jest.fn().mockReturnValue(repo)
        ResponseUtil.sendResponse = jest.fn().mockImplementation((res, message, data) =>
            res.status(200).json({
                success: true,
                message,
                data,
            })
        )

        const booksController = new BooksController()
        await booksController.get(mockRequest as Request, mockResponse as Response, nextFunction)

        expect(repo.find).toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'Successfully retrieved books',
            data: books,
        })
    })

    it('test_get_all_books_error_handling', async () => {
        const error = new Error('Database error')
        const repo = {
            find: jest.fn().mockRejectedValue(error),
        }
        AppDataSource.getRepository = jest.fn().mockReturnValue(repo)
        ResponseUtil.sendError = jest.fn().mockImplementation((res, message, statusCode, error) =>
            res.status(statusCode).json({
                success: false,
                message,
                error,
            })
        )

        const booksController = new BooksController()
        await booksController.get(mockRequest as Request, mockResponse as Response, nextFunction)

        expect(repo.find).toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(500)
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            message: 'Failed to retrieve books',
            error,
        })
    })

    it('test_get_all_books_empty_database', async () => {
        const repo = {
            find: jest.fn().mockResolvedValue([]),
        }
        AppDataSource.getRepository = jest.fn().mockReturnValue(repo)
        ResponseUtil.sendResponse = jest.fn().mockImplementation((res, message, data) =>
            res.status(200).json({
                success: true,
                message,
                data,
            })
        )

        const booksController = new BooksController()
        await booksController.get(mockRequest as Request, mockResponse as Response, nextFunction)

        expect(repo.find).toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'Successfully retrieved books',
            data: [],
        })
    })

    it('test_create_book_successfully', async () => {
        mockRequest.body = { name: 'Valid Book Name' }
        const mockBookEntity = new BookEntity()
        mockBookEntity.name = 'Valid Book Name'
        const mockRepo = {
            create: jest.fn().mockReturnValue(mockBookEntity),
            save: jest.fn().mockResolvedValue(mockBookEntity),
        }
        AppDataSource.getRepository = jest.fn().mockReturnValue(mockRepo)

        ResponseUtil.sendResponse = jest.fn().mockImplementation((res, message, data) =>
            res.status(200).json({
                success: true,
                message,
                data,
            })
        )

        const booksController = new BooksController()
        await booksController.create(mockRequest as Request, mockResponse as Response, nextFunction)

        expect(mockRepo.create).toHaveBeenCalledWith(expect.anything())
        expect(mockRepo.save).toHaveBeenCalledWith(mockBookEntity)
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'Successfully added',
            data: mockBookEntity,
        })
    })

    it('should return an error response when the name is empty', async () => {
        mockRequest.body = { name: '' }

        const next = jest.fn()

        const booksController = new BooksController()

        const asyncMock = jest.fn(async () => {
            await booksController.create(mockRequest as Request, mockResponse as Response, next)
        })

        asyncMock().catch((err) => {
            const firstError = err[0]
            expect(firstError).toBeInstanceOf(ValidationError)
            const vErr = firstError as ValidationError
            expect(vErr.property).toBe('name')
        })
    })

    it('test_create_book_without_name', async () => {
        mockRequest.body = {}

        const next = jest.fn()
        const booksController = new BooksController()
        const asyncMock = jest.fn(async () => {
            await booksController.create(mockRequest as Request, mockResponse as Response, next)
        })

        asyncMock().catch((err) => {
            const firstError = err[0]
            expect(firstError).toBeInstanceOf(ValidationError)
            const vErr = firstError as ValidationError
            expect(vErr.property).toBe('name')
        })
    })
})
