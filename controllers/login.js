const User = require('../models/user')
const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

loginRouter.post('/', async (request, response, next) => {
    const { username, email, password } = request.body
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return response.status(401).json({ error: 'invalid credentials' })
        }
        const isPasswordMatch = await bcrypt.compare(user.passwordHash, password)
        if (!isPasswordMatch) {
            return response.status(401).json({ error: 'invalid credentials' })
        }
        const userObjectForToken = {
            username: user.username,
            id: user.id,
            email: user.email
        }
        const token = jwt.sign(userObjectForToken, process.env.SECRET, { validFor: 60 * 60 })
        response.status(201).json({ token })
    } catch (error) {
        next(error)
    }
})

module.exports = loginRouter