const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const User = require('../models/User');

// Fetch Daily Challenge Status
router.get('/daily/status', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const today = new Date().toISOString().split('T')[0];
        const completedToday = user.lastDailyPlayDate === today;

        // Fetch yesterday's result
        const lastDailyAttempt = await Attempt.findOne({ userId: req.user.userId, topic: 'Daily Challenge' })
            .sort({ completedAt: -1 });

        let lastResult = null;
        if (lastDailyAttempt) {
            lastResult = {
                score: lastDailyAttempt.correctAnswers,
                total: lastDailyAttempt.totalQuestions,
                xpEarned: lastDailyAttempt.xpEarned,
                accuracy: Math.round((lastDailyAttempt.correctAnswers / lastDailyAttempt.totalQuestions) * 100)
            };
        }

        res.json({
            success: true,
            completedToday,
            lastResult
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch Daily Challenge status' });
    }
});

// Fetch Daily Challenge
router.get('/daily', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const today = new Date().toISOString().split('T')[0];

        if (user.lastDailyPlayDate === today) {
            return res.status(400).json({ error: 'You have already completed today\'s Daily Challenge!' });
        }

        const totalDocs = await Question.countDocuments();
        if (totalDocs < 10) return res.status(500).json({ error: 'Not enough questions.' });

        // Deterministic selection based on days since epoch
        const daysSinceEpoch = Math.floor(Date.now() / 86400000);
        // Avoid skipping out of bounds
        const maxSkip = Math.max(0, totalDocs - 10);
        const skipAmount = (daysSinceEpoch * 17) % (maxSkip || 1);

        const dailyQuestions = await Question.find().skip(skipAmount).limit(10);
        res.json(dailyQuestions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch Daily Challenge' });
    }
});

// Fetch questions for a topic (8 Easy, 7 Medium, 5 Hard)
router.get('/:topic', auth, async (req, res) => {
    try {
        const topic = req.params.topic;
        if (topic === 'daily' || topic === 'submit' || topic === 'status') return next(); // Pass to next handlers

        // In a real app we would pick random samples. Here we just take the limits.
        const easy = await Question.aggregate([{ $match: { topic, difficulty: 'easy' } }, { $sample: { size: 4 } }]);
        const medium = await Question.aggregate([{ $match: { topic, difficulty: 'medium' } }, { $sample: { size: 4 } }]);
        const hard = await Question.aggregate([{ $match: { topic, difficulty: 'hard' } }, { $sample: { size: 2 } }]);

        // Return combined list exactly as requested
        res.json([...easy, ...medium, ...hard]);
    } catch (err) {
        console.error('Fetch Questions Error:', err);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// Submit a quiz attempt
router.post('/submit', auth, async (req, res) => {
    try {
        const { topic, easyCorrect, mediumCorrect, hardCorrect } = req.body;
        const isDaily = topic === 'Daily Challenge';

        // Standardized XP: Easy=10, Medium=20, Hard=30
        const xpEarned = (easyCorrect * 10) + (mediumCorrect * 20) + (hardCorrect * 30);
        const correctAnswers = easyCorrect + mediumCorrect + hardCorrect;

        // Save attempt history
        const attempt = new Attempt({
            userId: req.user.userId,
            topic,
            correctAnswers,
            easyCorrect,
            mediumCorrect,
            hardCorrect,
            xpEarned
        });
        await attempt.save();

        // Fetch User to update cumulative Total Score (XP)
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Simplification: Always add the earned XP to totalXP (cumulative learning)
        user.totalXP += xpEarned;
        await user.save();

        res.json({ success: true, xpEarned, newTotalXP: user.totalXP });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Submission failed' });
    }
});

module.exports = router;
