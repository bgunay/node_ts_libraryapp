import express, { Express, Request, Response } from 'express'
import booksRoute from './routes/books'
import usersRoute from './routes/users'
import { ErrorHandler } from '@/errorhanding/ErrorHandler'
import bodyParser from 'body-parser'
import cors from 'cors'

const app: Express = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/users', usersRoute)
app.use('/books', booksRoute)
app.use('*', (req: Request, res: Response) => {
    return res.status(404).json({
        success: false,
        message: 'Invalid route',
    })
})
app.use(ErrorHandler.handleErrors)

export default app
