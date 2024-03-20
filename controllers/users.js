const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async(request, response, next) => {
    try {
        const users = await User.find({})
        response.json(users)
    } catch (error) {
        next(error)
    }
})

usersRouter.get('/:id', async(request, response, next) => {
    try {
        const user = await User.findById(request.params.id)
        if (!user) {
            response.sendStatus(404)
        }
        response.json(user)
    } catch (error) {
        next(error)
    }
})

module.exports = usersRouter