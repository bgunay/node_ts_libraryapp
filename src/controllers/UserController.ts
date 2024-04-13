import { AppDataSource } from '@database/data-source'
import { UserEntity } from '@database/entities/user.entity'
import { ResponseUtil } from '@/utils/Response'
import { isDefined, validateOrReject } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { UserDto } from '@/dto/user.dto'
import { BorrowDto } from '@/dto/borrow.dto'
import { BorrowEntity } from '@database/entities/borrow.entity'
import { BookEntity } from '@database/entities/book.entity'
import { IsNull } from 'typeorm'

export class UserController {
    async create(req: Request, res: Response, _: NextFunction) {
        const { name } = req.body
        const dto = new UserDto()
        dto.name = name

        await validateOrReject(dto)

        const repo = AppDataSource.getRepository(UserEntity)
        const newUser = repo.create(dto)
        await repo.save(newUser)

        return ResponseUtil.sendResponse(res, 'Successfully registered', newUser, null)
    }

    async get(_req: Request, res: Response, _: NextFunction) {
        try {
            const repo = AppDataSource.getRepository(UserEntity)
            const users = await repo.find({})
            return ResponseUtil.sendResponse(res, 'Successfully retrieved users', users, null)
        } catch (error) {
            return ResponseUtil.sendError(res, 'Failed to retrieve users', 500, error)
        }
    }

    async getById(req: Request, res: Response, _: NextFunction) {
        try {
            const { id } = req.params
            const repo = AppDataSource.getRepository(UserEntity)
            const user = await repo.findOne({
                where: {
                    id,
                },
                relations: ['borrows', 'borrows.book'],
            })

            if (user !== null) {
                const currentBorrows = user.borrows.filter((borrow) => !borrow.returnDate)
                const pastBorrows = user.borrows.filter((borrow) => borrow.returnDate)
                const userInfo = {
                    id: user.id,
                    name: user.name,
                    currentBorrows: currentBorrows.map((borrow) => ({
                        book: { name: borrow.book.name, id: borrow.book.id },
                        borrowDate: borrow.createdAt,
                    })),
                    pastBorrows: pastBorrows.map((borrow) => ({
                        book: { name: borrow.book.name, id: borrow.book.id },
                        borrowDate: borrow.createdAt,
                        returnDate: borrow.returnDate,
                    })),
                }

                return ResponseUtil.sendResponse(res, 'Successfully retrieved user', userInfo, null)
            } else {
                return ResponseUtil.sendError(res, 'UserEntity not found', 404)
            }
        } catch (error) {
            return ResponseUtil.sendError(res, 'Failed to retrieve user', 500, error)
        }
    }

    async borrow(req: Request, res: Response, _: NextFunction) {
        const params = req.params
        const bookRepo = AppDataSource.getRepository(BookEntity)

        const _book = await bookRepo.findOne({
            where: {
                id: params.bookId,
            },
        })
        if (!isDefined(_book)) {
            return ResponseUtil.sendError(res, 'BookEntity not found ', 404, null)
        } else {
            if (_book !== null) {
                const borrowRepo = AppDataSource.getRepository(BorrowEntity)
                const result = await borrowRepo.findOne({
                    where: {
                        book: { id: _book.id },
                        returnDate: IsNull(),
                    },
                })
                if (isDefined(result)) {
                    return ResponseUtil.sendError(res, 'BookEntity is not available', 404, null)
                }
            }
        }
        const userRepo = AppDataSource.getRepository(UserEntity)
        const _user = await userRepo.findOne({
            where: {
                id: params.userId,
            },
        })

        if (!isDefined(_user)) {
            return ResponseUtil.sendError(res, 'UserEntity not found ', 404, null)
        }
        const repo = AppDataSource.getRepository(BorrowEntity)
        const borrow = repo.create()
        if (_user !== null) {
            borrow.borrowedBy = _user
        }
        if (_book !== null) {
            borrow.book = _book
        }
        await repo.save(borrow)

        return ResponseUtil.sendResponse(res, 'Successfully reserved', borrow, null)
    }

    async return(req: Request, res: Response, _: NextFunction) {
        const params = req.params

        const dto = new BorrowDto()
        try {
            const { score } = req.body
            dto.score = score
            await validateOrReject(dto)
        } catch (error) {
            return ResponseUtil.sendError(res, `Score not found.${error} `, 500, null)
        }

        const bookRepo = AppDataSource.getRepository(BookEntity)
        const _book = await bookRepo.findOne({
            where: {
                id: params.bookId,
            },
        })
        if (!isDefined(_book)) {
            return ResponseUtil.sendError(res, 'BookEntity not found ', 404, null)
        }

        const userRepo = AppDataSource.getRepository(UserEntity)
        const user = await userRepo.findOne({
            where: {
                id: params.userId,
            },
        })
        if (!isDefined(user)) {
            return ResponseUtil.sendError(res, 'UserEntity not found ', 404, null)
        }
        Object.assign(dto, params)
        const repo = AppDataSource.getRepository(BorrowEntity)
        if (_book !== null && user !== null) {
            const result = await AppDataSource.query(
                `select *
         from borrows
         where borrowedById = '${user.id}'
           and bookId = '${_book.id}' `
            )
            if (!isDefined(result)) {
                return ResponseUtil.sendError(res, 'Not found', 404, null)
            }
            const item = result[0]
            if (item.returnDate !== null) {
                return ResponseUtil.sendError(res, 'This book has already been delivered', 500, null)
            }
            item.returnDate = new Date()
            item.score = dto.score

            await repo.save(item)
        }

        return ResponseUtil.sendResponse(res, 'Successfully return', null, null)
    }
}
