# MINDFORGE - Development Roadmap

This document outlines the structured to-do plan for the upcoming days to evolve MINDFORGE from a functional prototype into a polished, launch-ready application.

## Day 1: The Great Data Migration (Data Seeding)
*Goal: Successfully format, sanitize, and inject the AI-generated questions into the MongoDB Atlas database.*

- [ ] **Write the Seeding Script:** Create `backend/scripts/seedAI.js` to parse the raw AI JSON files. The script must merge the difficulty arrays, rename keys to match the database schema (e.g., `"question"` to `"questionText"`), and enforce proper topic capitalization.
- [ ] **Generate Remaining Datasets:** Execute the AI prompt to generate the remaining question batches for "Data Structures" and "Algorithms".
- [ ] **Data Injection execution:** Run the seeding script to upload the hundreds of questions into the production Atlas cluster.
- [ ] **Frontend Verification:** Boot the mobile app and complete quizzes across different topics to verify the questions are retrieved correctly and randomized.

## Day 2: The "Premium Feel" Polish Phase
*Goal: Enhance the User Experience (UX) to make the app feel responsive and professional.*

- [ ] **Haptic/Audio Feedback:** Integrate subtle sound effects (e.g., a "ding" for correct, a "thud" for incorrect) and corresponding haptic vibrations using `expo-haptics` and `expo-av`.
- [ ] **Visual Celebrations:** Implement a confetti animation (e.g., `react-native-confetti-cannon`) on the `ResultScreen` triggered by achieving a high score or leveling up.
- [ ] **Smooth Transitions:** Replace the rigid, instant swapping of quiz questions with smooth, animated sliding transitions using React Native's `Animated` API.
- [ ] **Premium Styling Tweaks:** Refine the UI by adding subtle glow effects to selected options and optimizing shadow depths across devices.

## Day 3: User Profiles & Historical Analytics
*Goal: Provide users with a dedicated space to view their progression and analyze their performance, increasing retention.*

- [ ] **Profile Screen (`ProfileScreen.js`):** Develop a dedicated tab displaying the user's total XP, current Level, and a dynamic progress bar indicating the XP required for the next level.
- [ ] **Accuracy Analytics Engine:** Update the backend aggregation pipelines to calculate the user's accuracy across different difficulty tiers and display this data visually on the profile.
- [ ] **Recent Activity Feed:** Implement a scrolling list displaying the user's latest quiz attempts and corresponding scores.

## Day 4: Expanding Core Features
*Goal: Introduce new gameplay elements to diversify the experience.*

- [ ] **New Question Modalities:** Update the backend schema and frontend UI to support "True/False" and potentially "Fill in the Blank" code snippet questions.
- [ ] **Global Streaks System:** Implement a "Daily Streak" tracker that monitors consecutive days logged in, rewarding users with bonus XP multipliers to encourage daily engagement.
