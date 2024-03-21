const Van = require('../models/van')
const vansRouter = require('express').Router()
const jwt = require('jsonwebtoken')

vansRouter.get('/', async (request, response, next) => {
    try {
        const vans = await Van.find({})
        response.json(vans)
    } catch (error) {
        next(error)
    }
})


vansRouter.get('/:id', async (request, response, next) => {
    try {
        const van = await Van.findById(request.params.id)
        if (!van) {
            return response.status(404).end()
        }
        response.json(van)
    } catch (error) {
        next(error)
    }
})


vansRouter.post('/', async (request, response, next) => {
    const { name, price, description, imageUrl, type } = request.body

    const vanData = new Van({
        name,
        price,
        description,
        imageUrl,
        type
    })
    try {
        const savedVan = await vanData.save()
        response.status(201).json(savedVan)
    } catch (error) {
        next(error)
    }
})

vansRouter.put('/:id', async (request, response, next) => {
    const { name, price, description, imageUrl, type } = request.body
    try {

        const van = await Van.findById(request.params.id)
        if (!van) {
            return response.status(404).end()
        }
        const vanData = {
            name,
            price,
            description,
            imageUrl,
            type
        }
        const updatedVan = await Van.findByIdAndUpdate(request.params.id,
            vanData,
            { new: true })
        response.status(201).json(updatedVan)
    } catch (error) {
        console.log(error.name)
        next(error)
    }
})

vansRouter.delete('/:id', async (request, response, next) => {
    try {
        await Van.findByIdAndDelete(request.params.id)
        response.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

module.exports = vansRouter