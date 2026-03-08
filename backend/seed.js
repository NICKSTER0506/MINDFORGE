const Question = require('./models/Question');

const seedQuestions = async () => {
    const questions = [
        { questionText: "What does CPU stand for?", options: ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Central Performance Unit"], correctAnswerIndex: 1, topic: "Programming", difficulty: "easy" },
        { questionText: "Which language is primarily used for web page styling?", options: ["HTML", "Python", "CSS", "Java"], correctAnswerIndex: 2, topic: "Programming", difficulty: "easy" },
        { questionText: "Which data structure uses FIFO order?", options: ["Stack", "Queue", "Tree", "Graph"], correctAnswerIndex: 1, topic: "Data Structures", difficulty: "easy" },
        { questionText: "Which symbol is used for comments in Python?", options: ["//", "<!-- -->", "#", "/* */"], correctAnswerIndex: 2, topic: "Programming", difficulty: "easy" },
        { questionText: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correctAnswerIndex: 1, topic: "Algorithms", difficulty: "medium" },
        { questionText: "Which keyword is used to create a function in JavaScript?", options: ["func", "function", "define", "method"], correctAnswerIndex: 1, topic: "Programming", difficulty: "easy" },
        { questionText: "Which data structure uses LIFO order?", options: ["Queue", "Stack", "Array", "Heap"], correctAnswerIndex: 1, topic: "Data Structures", difficulty: "easy" },
        { questionText: "What does HTML stand for?", options: ["HyperText Markup Language", "HighText Machine Language", "Hyperlink Markup Language", "Home Tool Markup Language"], correctAnswerIndex: 0, topic: "Programming", difficulty: "easy" },
        { questionText: "Which operator checks equality in JavaScript without type conversion?", options: ["==", "===", "=", "!="], correctAnswerIndex: 1, topic: "Programming", difficulty: "medium" },
        { questionText: "Which of these is NOT a programming language?", options: ["Python", "Java", "HTTP", "C++"], correctAnswerIndex: 2, topic: "Programming", difficulty: "easy" },
        { questionText: "What is the index of the first element in most programming arrays?", options: ["0", "1", "-1", "2"], correctAnswerIndex: 0, topic: "Programming", difficulty: "easy" },
        { questionText: "Which keyword is used for inheritance in Java?", options: ["implements", "extends", "inherits", "derive"], correctAnswerIndex: 1, topic: "Programming", difficulty: "medium" },
        { questionText: "Which of these is a NoSQL database?", options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"], correctAnswerIndex: 2, topic: "Programming", difficulty: "medium" },
        { questionText: "What does API stand for?", options: ["Application Programming Interface", "Advanced Program Interface", "Application Process Integration", "Automated Program Interface"], correctAnswerIndex: 0, topic: "Programming", difficulty: "medium" },
        { questionText: "Which loop is guaranteed to execute at least once?", options: ["for loop", "while loop", "do-while loop", "foreach loop"], correctAnswerIndex: 2, topic: "Programming", difficulty: "medium" },
        { questionText: "What does SQL stand for?", options: ["Structured Query Language", "Standard Query Language", "Sequential Query Language", "Structured Question Language"], correctAnswerIndex: 0, topic: "Programming", difficulty: "easy" },
        { questionText: "Which language runs in the browser?", options: ["Python", "JavaScript", "Java", "C++"], correctAnswerIndex: 1, topic: "Programming", difficulty: "easy" },
        { questionText: "What does Git primarily help with?", options: ["Compiling code", "Version control", "Running programs", "Database management"], correctAnswerIndex: 1, topic: "Programming", difficulty: "easy" },
        { questionText: "Which sorting algorithm has average complexity O(n log n)?", options: ["Bubble Sort", "Merge Sort", "Selection Sort", "Insertion Sort"], correctAnswerIndex: 1, topic: "Algorithms", difficulty: "medium" },
        { questionText: "Which programming paradigm does Java mainly follow?", options: ["Procedural", "Functional", "Object-Oriented", "Logic"], correctAnswerIndex: 2, topic: "Programming", difficulty: "medium" }
    ];

    try {
        const count = await Question.countDocuments();
        if (count === 0) {
            await Question.insertMany(questions);
            console.log(`[SEED] Inserted ${questions.length} initial questions into the database.`);
        }
    } catch (err) {
        console.error('[SEED] Failed to seed questions:', err);
    }
};

module.exports = seedQuestions;
