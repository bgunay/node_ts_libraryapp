import express from 'express'
import { ErrorHandler } from '@/errorhanding/ErrorHandler'
import { UserController } from '@/controllers/UserController'

const userController = new UserController()

const router = express.Router()
router.get('/', userController.get)
router.get('/:id', userController.getById)
router.post('/', ErrorHandler.catchErrors(userController.create))
router.post('/:userId/borrow/:bookId', ErrorHandler.catchErrors(userController.borrow))
router.post('/:userId/return/:bookId', ErrorHandler.catchErrors(userController.return))

export default router
