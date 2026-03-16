const Question = require('./models/Question');
const fs = require('fs');
const path = require('path');

const seedQuestions = async () => {
    try {
        const dataDir = path.join(__dirname, 'data');
        const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
        
        let allQuestions = [];

        for (const file of files) {
            const content = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
            
            // Handle if it's the programming.json format with easy/medium/hard keys
            if (content.easy || content.medium || content.hard) {
                if (content.easy) allQuestions.push(...content.easy);
                if (content.medium) allQuestions.push(...content.medium);
                if (content.hard) allQuestions.push(...content.hard);
            } else if (Array.isArray(content)) {
                allQuestions.push(...content);
            }
        }

        // Force reseed for development: delete all and re-insert
        await Question.deleteMany({});
        await Question.insertMany(allQuestions);
        console.log(`[SEED] Inserted ${allQuestions.length} questions from ${files.length} topics into the database.`);
    } catch (err) {
        console.error('[SEED] Failed to seed questions:', err);
    }
};

module.exports = seedQuestions;
