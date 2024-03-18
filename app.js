const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const vansRouter = require('./controllers/vans')

const app = express()

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGO_URL)
    .then(() => logger.info('connected to MongoDB'))
    .catch(error => logger.error(error.message))


app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)

app.use('/api/vans', vansRouter)

app.use(middleware.unknownEndpointHandler)
app.use(middleware.errorHandler)

module.exports = app