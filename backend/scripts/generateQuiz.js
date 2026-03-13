const fs = require('fs');
const path = require('path');

const programmingQuestionsPath = path.join(__dirname, '..', 'data', 'programming.json');

const getRandomQuestions = (questions, count) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const generateQuiz = () => {
    try {
        const rawData = fs.readFileSync(programmingQuestionsPath, 'utf8');
        const questionsByDifficulty = JSON.parse(rawData);

        const easyQuestions = questionsByDifficulty.easy;
        const mediumQuestions = questionsByDifficulty.medium;
        const hardQuestions = questionsByDifficulty.hard;

        const selectedEasy = getRandomQuestions(easyQuestions, 4);
        const selectedMedium = getRandomQuestions(mediumQuestions, 4);
        const selectedHard = getRandomQuestions(hardQuestions, 2);

        const quizQuestions = [...selectedEasy, ...selectedMedium, ...selectedHard];

        console.log(JSON.stringify(quizQuestions, null, 2));
        return quizQuestions;
    } catch (error) {
        console.error('Error generating quiz:', error);
        return [];
    }
};

generateQuiz();
