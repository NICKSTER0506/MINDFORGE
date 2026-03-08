const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true },
    totalQuestions: { type: Number, default: 20 },
    correctAnswers: { type: Number, default: 0 },
    easyCorrect: { type: Number, default: 0 },
    mediumCorrect: { type: Number, default: 0 },
    hardCorrect: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now }
});

// Compound index to quickly find the best attempt per topic for a user
attemptSchema.index({ userId: 1, topic: 1, xpEarned: -1 });

module.exports = mongoose.model('Attempt', attemptSchema);
