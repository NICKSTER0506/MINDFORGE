const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    topic: { type: String, required: true, enum: ['Programming', 'Data Structures', 'Aptitude', 'Algorithms'] },
    difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswerIndex: { type: Number, required: true }
});

module.exports = mongoose.model('Question', questionSchema);
