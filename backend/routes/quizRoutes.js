const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const User = require('../models/User');

// Fetch questions for a topic (8 Easy, 7 Medium, 5 Hard)
router.get('/:topic', auth, async (req, res) => {
    try {
        const topic = req.params.topic;

        // In a real app we would pick random samples. Here we just take the limits.
        const easy = await Question.aggregate([{ $match: { topic, difficulty: 'easy' } }, { $sample: { size: 8 } }]);
        const medium = await Question.aggregate([{ $match: { topic, difficulty: 'medium' } }, { $sample: { size: 7 } }]);
        const hard = await Question.aggregate([{ $match: { topic, difficulty: 'hard' } }, { $sample: { size: 5 } }]);

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

        // Best attempt logic: calculate XP
        // Easy=10, Medium=15, Hard=20
        const xpEarned = (easyCorrect * 10) + (mediumCorrect * 15) + (hardCorrect * 20);
        const correctAnswers = easyCorrect + mediumCorrect + hardCorrect;

        // Find previous best attempt for this topic
        const previousBest = await Attempt.findOne({ userId: req.user.userId, topic })
            .sort({ xpEarned: -1 });

        let xpToAdd = xpEarned;

        if (previousBest) {
            if (xpEarned > previousBest.xpEarned) {
                // User improved, only add the difference
                xpToAdd = xpEarned - previousBest.xpEarned;
            } else {
                // User did not improve, no new XP
                xpToAdd = 0;
            }
        }

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

        if (xpToAdd > 0) {
            // Update User totalXP
            const user = await User.findById(req.user.userId);
            user.totalXP += xpToAdd;
            await user.save();
            newTotalXP = user.totalXP;
        } else {
            const user = await User.findById(req.user.userId);
            newTotalXP = user.totalXP;
        }

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

        res.json({ success: true, xpEarned, newTotalXP, newLevel });
    } catch (err) {
        res.status(500).json({ error: 'Submission failed' });
    }
});

module.exports = router;
