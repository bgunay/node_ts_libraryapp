import { isDefined, validateOrReject } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { AppDataSource } from '@database/data-source'
import { ResponseUtil } from '@/utils/Response'
import { BookEntity } from '@database/entities/book.entity'
import { BookDto } from '@/dto/book.dto'
import { IsNull } from 'typeorm'
import { BorrowEntity } from '@database/entities/borrow.entity'

/**
 * BooksController class for handling book-related operations.
 */
export class BooksController {
    /**
     * Retrieves all books from the database.
     *
     * @param _ - Request object, not used in this method.
     * @param res - Response object to send the retrieved books.
     * @param _1 - NextFunction object, not used in this method.
     * @returns A Promise that resolves to a Response object containing the retrieved books.
     * @throws An error if there's a failure in retrieving the books.
     */
    async get(_: Request, res: Response, _1: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(BookEntity)
            const users = await repo.find()
            return ResponseUtil.sendResponse(res, 'Successfully retrieved books', users, null)
        } catch (error) {
            return ResponseUtil.sendError(res, 'Failed to retrieve books', 500, error)
        }
    }

    /**
     * Retrieves a specific book from the database by its id.
     *
     * @param req - Express request object containing the book id in the params.
     * @param res - Express response object to send the retrieved book.
     * @returns A Promise that resolves to a Response object containing the retrieved book.
     * @throws An error if there's a failure in retrieving the book.
     */
    async getBook(req: Request, res: Response): Promise<Response> {
        const { id } = req.params
        const book = await AppDataSource.getRepository(BookEntity).findOneByOrFail({
            id,
        })
        const average = await AppDataSource.query(`select avg(score) as avg
                                               from borrows
                                               where bookId='${id}' and returnDate is not null
                                               group by bookId `)
        const borrowRepo = AppDataSource.getRepository(BorrowEntity)
        const result = await borrowRepo.findOne({
            where: {
                book: { id: book.id },
                returnDate: IsNull(),
            },
        })
        const bookInfo = {
            book: book.toPayload(),
            averageScore: average.length > 0 ? average[0].avg : 0,
            available: !isDefined(result),
        }
        return ResponseUtil.sendResponse<any>(res, 'Fetch book successfully', bookInfo)
    }

    /**
     * Creates a new book in the database.
     *
     * @param req - Express request object containing the book details in the body.
     * @param res - Express response object to send the created book.
     * @param _ - NextFunction object, not used in this method.
     * @returns A Promise that resolves to a Response object containing the created book.
     * @throws An error if there's a failure in creating the book.
     */
    async create(req: Request, res: Response, _: NextFunction) {
        const { name } = req.body
        const dto = new BookDto()
        dto.name = name

        await validateOrReject(dto)

        const repo = AppDataSource.getRepository(BookEntity)
        const newBook = repo.create(dto)
        await repo.save(newBook)

        return ResponseUtil.sendResponse(res, 'Successfully added', newBook, null)
    }
}
