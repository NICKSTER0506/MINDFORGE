# MINDFORGE

MINDFORGE is a full-stack, mobile-first quiz and learning application designed to test and improve users' knowledge across various technical domains, such as Programming, Data Structures, and Algorithms. It features user authentication, a dynamic quiz engine, XP-based progression, and a competitive leaderboard.

This repository is structured as a monorepo containing both the React Native mobile application and the Node.js backend API.

---

## 🏗️ Architecture & Tech Stack

MINDFORGE follows a modern client-server architecture, decoupled into a lightweight mobile frontend and a RESTful backend API. 

### Frontend (Mobile App)
The frontend is built for cross-platform compatibility (iOS, Android, and Web) using a single codebase.
- **Framework:** **React Native & Expo**
  - *Why:* Expo provides a managed workflow that drastically speeds up development. It abstracts away complex native build processes (Gradle/Xcode) and offers out-of-the-box modules for routing, assets, and device APIs. React Native allows us to write JavaScript code that compiles to truly native UI components.
- **Navigation:** **React Navigation** (`@react-navigation/native-stack`)
  - *Why:* The industry standard for RN routing. It utilizes native navigation APIs (UINavigationController on iOS, Fragment on Android) to provide smooth 60fps transitions and a native feel.
- **State Management:** **React Context API** (`AuthContext`)
  - *Why:* Kept simple for now. Given the current scope, Context is perfectly adequate for managing global user authentication state without the boilerplate overhead of Redux.
- **Local Storage:** **AsyncStorage**
  - *Why:* Used to securely persist JWT auth tokens across app reloads, ensuring the user remains logged in.

### Backend (Server & API)
The backend is a robust RESTful API built on the Node.js runtime.
- **Runtime & Framework:** **Node.js & Express.js**
  - *Why:* Express provides a minimalist, unopinionated routing layer that is extremely fast to build with. Node's non-blocking I/O model is perfect for handling concurrent API requests for the quiz engine.
- **Database:** **MongoDB** (Currently `mongodb-memory-server` for local dev)
  - *Why:* As a NoSQL database, MongoDB offers a flexible schema design. This is ideal for quiz questions and options, which could vary in length or structure. Using an in-memory instance allows for rapid local development without needing cloud credentials, though it can seamlessly be swapped for MongoDB Atlas in production.
- **ODM:** **Mongoose**
  - *Why:* Enforces strict schemas and data validation at the application layer before anything is written to the database.
- **Authentication:** **JSON Web Tokens (JWT) & bcrypt**
  - *Why:* JWTs provide stateless authentication, meaning the backend doesn't need to look up session IDs in the database on every request. `bcrypt` securely hashes user passwords before storage.

---

## ✨ Core Features & Design

1. **Modern Dark Theme (DeepWorkR Inspired):**
   - A premium, focused interface featuring a layered dark palette (`#0B1220` background).
   - Minimalist design using subtle borders and soft glow interactions instead of heavy shadows.
2. **User Authentication & Profiles:**
   - Secure registration/login with level-based progression and XP tracking.
3. **Dynamic Quiz Engine:**
   - Real-time question sampling from MongoDB across various topics and difficulty tiers (Easy, Medium, Hard).
   - Automated database seeding for rapid development.
4. **Comprehensive App Structure (12 Screens):**
   - **Main Flow**: Login, Home, Topic Selection, Quiz, Results, Review.
   - **Growth & Social**: Stats, Leaderboard, Profile, Friends.
   - **Engagement**: Daily Challenge, Settings (with haptic & theme toggles).
5. **Progression & XP System:**
   - Dynamic level calculation: `Required XP = 200 + (Level * 100)`.
   - XP rewards based on question difficulty and user performance.

---

## 🚀 Scalability & Future-Proofing Factors

While MINDFORGE is currently designed for local testing, the architecture inherently supports scaling to production load:

### 1. Database Scaling (MongoDB)
- **Transition to Atlas:** The `mongodb-memory-server` can be instantaneously swapped out for a fully managed MongoDB Atlas cluster by simply changing the `MONGO_URI` in an `.env` file.
- **Indexing:** Essential queries, such as sorting the leaderboard or fetching questions, can be optimized by adding indexes to `User.totalXP` and `Question.topic` / `Question.difficulty`. 
- **Aggregation Pipelines:** The quiz route currently uses Mongoose `$sample` within an aggregate pipeline. While great for randomizing, on a database with millions of questions, `$sample` can be slow unless correctly indexed.

### 2. Stateless Backend (JWT)
- Because user sessions are validated via JWT instead of stateful server sessions, the Express backend is completely stateless.
- **Horizontal Scaling:** This means you can spin up 5 or 10 instances of your Node `server.js` behind a Load Balancer (like Nginx or AWS ALB), and any server can handle any request from any user without dropping their session context.

### 3. Frontend Optimizations
- **Memoization:** As the app grows, React's `useMemo` and `useCallback` can be implemented to prevent unnecessary re-renders in deep component trees (like large Quiz lists).
- **Over-The-Air (OTA) Updates:** By using Expo (`expo-updates`), critical bug fixes and UI updates can be pushed directly to users' phones without needing them to download a new binary from the App Store or Google Play Store.

---

## 💻 Local Development Setup

To run MINDFORGE locally, you need two terminals. Ensure you have Node.js and an Android Emulator installed.

### 1. Start the Backend API
Navigate to the backend directory and start the server:
```bash
cd backend
npm install
node server.js
```
*Note: This will output "In-memory MongoDB connection established" and automatically seed the database.*

### 2. Start the Mobile Client
In a new terminal, navigate to the mobile directory and utilize Expo to run the app:
```bash
cd mobile
npm install
npm run android -- --clear
```
*Tip: Ensure your API Base URL in the mobile app's screen files (e.g., `QuizScreen.js` and `LoginScreen.js`) points to your laptop's Local IPv4 address rather than `localhost` if testing on a physical device.*
