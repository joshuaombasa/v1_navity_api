const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const Van = require('../models/van')
const helper = require('./test_helper')

beforeEach(async () => {
    await Van.deleteMany({})
    for (let van of helper.someVans) {
        const vanObject = new Van(van)
        await vanObject.save()
    }

})

describe('when theres are initially some vans', () => {
    test('vans are returned as json', async () => {
        await api.get('/api/vans')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all vans are returned', async () => {
        const response = await api.get('/api/vans')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(helper.someVans.length)
    })

    test('a specific van is among the returned vans', async () => {
        const response = await api.get('/api/vans')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const names = response.body.map(item => item.name)
        expect(names).toContain(helper.someVans[0].name)
    })
})


describe('fetching a single van', () => {
    test('succeeds given a valid id', async () => {
        const vansAtStart = await helper.vansInDB()
        const response = await api.get(`/api/vans/${vansAtStart[0].id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('fails with statuscode 404 when given a nonexistent id', async () => {
        const nonExistentId = await helper.nonExistentId()
        await api.get(`/api/vans/${nonExistentId}`)
            .expect(404)
    })

    test('fails with statuscode 400 when given an invalid id', async () => {
        await api.get(`/api/vans/hyuugygyygu`)
            .expect(400)
    })
})


describe('addition of a new van', () => {
    test('succeeds when given valid data', async () => {
        const vansAtStart = await helper.vansInDB()
        const response = await api.post(`/api/vans`)
            .send(helper.validData)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const name = response.body.name
        expect(name).toBe(helper.validData.name)

        const vansAtEnd = await helper.vansInDB()
        expect(vansAtEnd).toHaveLength(vansAtStart.length + 1)
    })

    test('fails with statuscode 400 when given Invalid data', async () => {
        const vansAtStart = await helper.vansInDB()
        const response = await api.post(`/api/vans`)
            .send(helper.invalidData)
            .expect(400)

        const vansAtEnd = await helper.vansInDB()
        expect(vansAtEnd).toHaveLength(vansAtStart.length)
    })
})


describe('updating a van', () => {
    test('succeeds when given valid data', async () => {
        const vansAtStart = await helper.vansInDB()
        const validUpdate = { name: 'Updated VanName', price: 70, description: "This is valid van in update test", imageUrl: "https://assets.scrimba.com/advanced-react/react-router/green-wonder.png", type: "rugged" }
        const response = await api.put(`/api/vans/${vansAtStart[0].id}`)
            .send(validUpdate)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const name = response.body.name
        expect(name).toBe(validUpdate.name)
    })

    test('fails with statuscode 400 when given Invalid id', async () => {
        const validUpdate = { name: 'Updated VanName', price: 70, description: "This is valid van in update test", imageUrl: "https://assets.scrimba.com/advanced-react/react-router/green-wonder.png", type: "rugged" }
        const response = await api.put(`/api/vans/efelkgeglk`)
            .send(validUpdate)
            .expect(400)

        const name = response.body.name
        expect(name).not.toBe(validUpdate.name)
    })

    test('fails with statuscode 404 when given nonexistent id', async () => {
        const nonExistentId = await helper.nonExistentId()
        const validUpdate = { name: 'Updated VanName', price: 70, description: "This is valid van in update test", imageUrl: "https://assets.scrimba.com/advanced-react/react-router/green-wonder.png", type: "rugged" }
        const response = await api.put(`/api/vans/${nonExistentId}`)
            .send(validUpdate)
            .expect(404)

        const name = response.body.name
        expect(name).not.toBe(validUpdate.name)
    })
})

describe('deleting a van', () => {
    test('succeeds when given a valid id', async () => {
        const vansAtStart = await helper.vansInDB()
        const response = await api.delete(`/api/vans/${vansAtStart[0].id}`)
            .expect(204)

        const vansAtEnd = await helper.vansInDB()
        expect(vansAtEnd).toHaveLength(vansAtStart.length - 1)
    })
})


afterAll(async () => {
    mongoose.connection.close()
})