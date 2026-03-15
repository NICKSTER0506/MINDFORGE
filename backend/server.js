require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.warn("WARNING: MONGO_URI is missing from .env.");
        }

        await mongoose.connect(mongoUri);
        console.log(`MongoDB connection established to Atlas cluster`);
        await require('./seed')();

        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // Handle graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully.');
            server.close(() => {
                console.log('Process terminated.');
            });
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
