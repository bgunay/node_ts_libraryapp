import { faker } from '@faker-js/faker'
import request from 'supertest'
import app from '../src/app'
import { AppDataSource } from '@database/data-source'

const bookName = `Book ${faker.internet.color()}` //Creating a random bookName

describe('Testing the express route', () => {
    beforeAll(async () => {
        await AppDataSource.initialize()
    }, 3000)

    test('successful create book test', async () => {
        await request(app)
            .post('/books')
            .send({
                name: bookName,
            }) //
            .then((res) => {
                expect(res.status).toBe(200) //Checking if the status code is 200
            })
    })

    test('successful get books all test', async () => {
        //Testing the successful signup
        await request(app)
            .get('/books')
            .then((res) => {
                expect(res.status).toBe(200) //Checking if the status code is 200
            })
    })

    test('failed create book', async () => {
        await request(app)
            .post('/books')
            .send({}) //Sending an empty request body
            .then((res) => {
                expect(res.status).toBe(422) //Checking if the status code is 422
            })
    })
})
