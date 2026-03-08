const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Global Top 10 Leaderboard
router.get('/', async (req, res) => {
    try {
        const topUsers = await User.find()
            .sort({ totalXP: -1 })
            .limit(10)
            .select('username totalXP');

        res.json(topUsers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

module.exports = router;
