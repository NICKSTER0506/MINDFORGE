const Question = require('./models/Question');
const fs = require('fs');
const path = require('path');

const seedQuestions = async () => {
    try {
        const questionsByDifficulty = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'data', 'programming.json'), 'utf8')
        );

        const questions = [
            ...questionsByDifficulty.easy,
            ...questionsByDifficulty.medium,
            ...questionsByDifficulty.hard
        ];

        // Force reseed for development: delete all and re-insert
        await Question.deleteMany({});
        await Question.insertMany(questions);
        console.log(`[SEED] Inserted ${questions.length} questions into the database.`);
    } catch (err) {
        console.error('[SEED] Failed to seed questions:', err);
    }
};

module.exports = seedQuestions;
