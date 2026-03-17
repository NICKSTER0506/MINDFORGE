const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Attempt = require('../models/Attempt');
const User = require('../models/User');

// Fetch daily stats (Today's snapshot)
router.get('/daily-stats', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const dailyAttempts = await Attempt.find({
            userId,
            completedAt: { $gte: today, $lt: tomorrow }
        });

        let attemptedToday = 0;
        let solvedToday = 0;

        dailyAttempts.forEach(attempt => {
            attemptedToday += (attempt.totalQuestions || 20); // Default fallback if missing
            solvedToday += attempt.correctAnswers;
        });

        const accuracyToday = attemptedToday > 0 
            ? Math.round((solvedToday / attemptedToday) * 100) 
            : null;

        res.json({
            success: true,
            attemptedToday,
            solvedToday,
            accuracyToday
        });

    } catch (err) {
        console.error("Daily Stats Error:", err);
        res.status(500).json({ error: 'Failed to fetch daily stats' });
    }
});

router.get('/stats', auth, async (req, res) => {
    try {
        const userId = req.user.userId;

        // 1. Fetch user for Total XP & Level
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });

        // 2. Fetch all attempts for this user sorted by newest first
        const allAttempts = await Attempt.find({ userId }).sort({ completedAt: -1 });

        const totalQuizzes = allAttempts.length;
        if (totalQuizzes === 0) {
            return res.json({
                success: true,
                overview: {
                    quizzesPlayed: 0,
                    accuracy: 0,
                    totalScore: user.totalXP,
                    averageScore: 0
                },
                recentScores: [],
                topicAccuracy: [],
                difficultyAccuracy: { easy: 0, medium: 0, hard: 0 },
                recentQuizzes: []
            });
        }

        // No streak tracking
        let totalCorrect = 0;
        let totalQuestionsAll = 0;
        let diffStats = {
            easy: { correct: 0, total: 0 },
            medium: { correct: 0, total: 0 },
            hard: { correct: 0, total: 0 }
        };
        let topicMap = {};
        const recentQuizzes = [];

        // Calculate the rest (Newest to oldest)
        allAttempts.forEach((attempt, index) => {
            totalCorrect += attempt.correctAnswers;
            totalQuestionsAll += attempt.totalQuestions;

            const scorePercent = (attempt.correctAnswers / attempt.totalQuestions) * 100;

            // Recent quizzes list
            if (index < 5) {
                recentQuizzes.push({
                    id: attempt._id,
                    topic: attempt.topic,
                    scoreText: `${attempt.correctAnswers}/${attempt.totalQuestions}`,
                    percent: scorePercent,
                    date: attempt.completedAt
                });
            }

            // Topic Aggregation
            if (!topicMap[attempt.topic]) {
                topicMap[attempt.topic] = { correct: 0, total: 0 };
            }
            topicMap[attempt.topic].correct += attempt.correctAnswers;
            topicMap[attempt.topic].total += attempt.totalQuestions;

            // Difficulty Aggregation (assuming frontend passes these, or deduce from known limits)
            diffStats.easy.correct += attempt.easyCorrect || 0;
            diffStats.easy.total += 4; // Based on quiz generator limits

            diffStats.medium.correct += attempt.mediumCorrect || 0;
            diffStats.medium.total += 4;

            diffStats.hard.correct += attempt.hardCorrect || 0;
            diffStats.hard.total += 2;
        });

        const overallAccuracy = Math.round((totalCorrect / totalQuestionsAll) * 100);
        const averageScore = (totalCorrect / totalQuizzes).toFixed(1);

        // Map topic data into array
        const topicAccuracy = Object.keys(topicMap).map(topic => {
            const data = topicMap[topic];
            return {
                topic,
                accuracy: Math.round((data.correct / data.total) * 100)
            };
        });

        // Map difficulty
        const difficultyAccuracy = {
            easy: diffStats.easy.total > 0 ? Math.round((diffStats.easy.correct / diffStats.easy.total) * 100) : 0,
            medium: diffStats.medium.total > 0 ? Math.round((diffStats.medium.correct / diffStats.medium.total) * 100) : 0,
            hard: diffStats.hard.total > 0 ? Math.round((diffStats.hard.correct / diffStats.hard.total) * 100) : 0
        };

        // Recent chart data (last 5, chronological orded for chart)
        const recentScores = [...recentQuizzes].reverse().map(q => q.percent);

        res.json({
            success: true,
            overview: {
                quizzesPlayed: totalQuizzes,
                accuracy: overallAccuracy,
                totalScore: user.totalXP,
                averageScore: `${averageScore} / 20`
            },
            recentScores: recentScores.length > 0 ? recentScores : [0],
            topicAccuracy,
            difficultyAccuracy,
            recentQuizzes
        });

    } catch (err) {
        console.error("Stats Error:", err);
        res.status(500).json({ error: 'Failed to fetch user stats' });
    }
});

module.exports = router;
