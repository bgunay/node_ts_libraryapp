import { faker } from '@faker-js/faker'
import request from 'supertest'
import app from '../src/app'
import { AppDataSource } from '@database/data-source'

const username = faker.internet.userName() //Creating a random username

describe('Testing the express route', () => {
    beforeAll(async () => {
        await AppDataSource.initialize()
    }, 3000)

    test('successful create user test', async () => {
        await request(app)
            .post('/users')
            .send({
                name: username,
            }) //
            .then((res) => {
                expect(res.status).toBe(200) //Checking if the status code is 200
            })
    })

    test('successful get all users test', async () => {
        await request(app)
            .get('/users')
            .then((res) => {
                expect(res.status).toBe(200) //Checking if the status code is 200
            })
    })

    test('failed create user', async () => {
        await request(app)
            .post('/users')
            .send({}) //Sending an empty request body
            .then((res) => {
                expect(res.status).toBe(422) //Checking if the status code is 422
            })
    })
})
