const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response, next) => {
    try {
        const users = await User.find({})
        response.json(users)
    } catch (error) {
        next(error)
    }
})

usersRouter.get('/:id', async (request, response, next) => {
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


usersRouter.post('/:id', async (request, response, next) => {
    const { username, name, email, password } = request.body

    const saltrounds = 10

    try {
        const user = await User.findById(request.params.id)
        if (!user) {
            response.sendStatus(404)
        }

        const passwordHash = await bcrypt.hash(password, saltrounds)
        
        const userData = new User({
            username,
            name,
            email,
            passwordHash
        })

        const savedUser = await userData.save()
        response.status(201).json(savedUser)
    } catch (error) {
        next(error)
    }
})


usersRouter.put('/:id', async (request, response, next) => {
    const { username, name, email, password } = request.body
    try {
        const user = await User.findById(request.params.id)
        if (!user) {
            response.sendStatus(404)
        }

        const userData = {
            username,
            name,
            email,
            password
        }

        const savedUser = await User.findByIdAndUpdate(
            request.params.id,
            userData,
            {new: true}
        )
        response.json(savedUser)
    } catch (error) {
        next(error)
    }
})

usersRouter.delete('/:id', async (request, response, next) => {
    try {
        await User.findByIdAndDelete(request.params.id)
        response.sendStatus(204)
    } catch (error) {
        next(error)
    }
})


module.exports = usersRouter