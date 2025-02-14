require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

const vansRouter = require('./controllers/vans');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const app = express();

// MongoDB Connection
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URL, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });
        logger.info('✅ Connected to MongoDB');
    } catch (error) {
        logger.error('❌ MongoDB connection error:', error.message);
        process.exit(1); // Exit process on DB failure
    }
};

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

// API Routes
app.use('/api/vans', vansRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

// Error Handling
app.use(middleware.unknownEndpointHandler);
app.use(middleware.errorHandler);

// Graceful Shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    logger.info('🔄 MongoDB connection closed');
    process.exit(0);
});

module.exports = app;
