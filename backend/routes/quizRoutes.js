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
            dailyStreak: user.dailyStreak || 0,
            bestStreak: user.maxDailyStreak || (user.dailyStreak || 0),
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
        if (topic === 'daily' || topic === 'submit') return; // Handled by other routes

        // In a real app we would pick random samples. Here we just take the limits.
        const easy = await Question.aggregate([{ $match: { topic, difficulty: 'easy' } }, { $sample: { size: 4 } }]);
        const medium = await Question.aggregate([{ $match: { topic, difficulty: 'medium' } }, { $sample: { size: 4 } }]);
        const hard = await Question.aggregate([{ $match: { topic, difficulty: 'hard' } }, { $sample: { size: 2 } }]);

        // Return combined list exactly as requested
        res.json([...easy, ...medium, ...hard]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// Submit a quiz attempt
router.post('/submit', auth, async (req, res) => {
    try {
        const { topic, easyCorrect, mediumCorrect, hardCorrect } = req.body;

        const isDaily = topic === 'Daily Challenge';

        // Best attempt logic: calculate XP
        // Easy=10, Medium=15, Hard=20 (If Daily, 2x XP modifier)
        let xpEarned = (easyCorrect * 10) + (mediumCorrect * 15) + (hardCorrect * 20);
        if (isDaily) xpEarned *= 2; // 2X XP for Daily Challenge

        const correctAnswers = easyCorrect + mediumCorrect + hardCorrect;

        // Find previous best attempt for this topic BEFORE saving the new one
        const previousBest = await Attempt.findOne({ userId: req.user.userId, topic })
            .sort({ xpEarned: -1 });

        // Save new attempt history
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

        let newTotalXP = 0;
        let newLevel = 1;

        // Fetch User to update XP
        const user = await User.findById(req.user.userId);

        let xpToAdd = xpEarned;

        if (isDaily) {
            // Update daily streak
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

            if (user.lastDailyPlayDate === yesterday) {
                user.dailyStreak += 1; // Continuing streak
            } else if (user.lastDailyPlayDate !== today) {
                user.dailyStreak = 1; // Reset streak if missed a day
            }

            // Check if it's a new best streak
            if (user.dailyStreak > (user.maxDailyStreak || 0)) {
                user.maxDailyStreak = user.dailyStreak;
            }

            user.lastDailyPlayDate = today;
            // For daily, always give full XP earned
            xpToAdd = xpEarned;
        } else {
            // Find previous best attempt for regular topic
            if (previousBest) {
                if (xpEarned > previousBest.xpEarned) {
                    xpToAdd = xpEarned - previousBest.xpEarned;
                } else {
                    xpToAdd = 0;
                }
            }
        }

        user.totalXP += xpToAdd;
        await user.save();
        newTotalXP = user.totalXP;

        // Calculate new level

        // Level up formula: RequiredXP = 200 + (Level * 100) -> wait, dynamic level calc:
        // TotalXP = Level 1 (0 to 299), Level 2 (300 to 599)... wait.
        const calculateLevel = (xp) => {
            let lvl = 1;
            let reqXp = 300; // 200 + (1 * 100)
            let currentXp = xp;
            while (currentXp >= reqXp) {
                lvl++;
                currentXp -= reqXp;
                reqXp = 200 + (lvl * 100);
            }
            return lvl;
        };

        newLevel = calculateLevel(newTotalXP);

        res.json({ success: true, xpEarned: xpToAdd, newTotalXP, newLevel });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Submission failed' });
    }
});

module.exports = router;
