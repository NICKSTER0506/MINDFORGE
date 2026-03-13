# MINDFORGE UI Layout Specification

## 1. Login / Welcome Screen

**Purpose:** Entry point + identity

**Layout:**
- **Top:** App logo / MINDFORGE title
- **Center:** Username input, Optional avatar selection
- **Bottom:** Start Button

**Optional UI extras:**
- Glowing logo
- Subtle gradient background

**Current Implementation:** `LoginScreen.js` ✅
- Has MINDFORGE title, email/password inputs, register/login toggle
- **Missing:** Glowing logo, avatar selection, gradient background

---

## 2. Home Dashboard

**Purpose:** Main hub of the app

**Layout:**
- **Top:** Greeting: "Welcome, Nikhil" + Profile icon
- **Center (card grid):**
  - Card 1: Start Quiz
  - Card 2: Daily Challenge
  - Card 3: Leaderboard
  - Card 4: Stats
  - Card 5 (optional): Categories
- **Bottom:** Small streak indicator + XP/progress bar

**Design idea:**
```
Header
[ Start Quiz ]
[ Daily Challenge ]

[ Leaderboard ]
[ Stats ]

Progress Bar
```

**Current Implementation:** `HomeScreen.js` ✅
- Has Level display, XP progress bar
- Has Daily Challenge button, Practice by Topic button
- Has Leaderboard, Profile cards, Stats button
- **Missing:** Welcome greeting with username, more polished grid layout

---

## 3. Category Selection (Optional but good)

**Purpose:** Lets users choose topic

**Layout:**
- **Top:** "Choose Category"
- **Grid cards:**
  - Programming
  - General Knowledge
  - Math
  - Science
  - Logic
- **Each card:** Icon + category name

**Current Implementation:** `TopicSelectionScreen.js` ✅
- Has grid layout with cards
- Topics: Programming, Data Structures, Aptitude, Algorithms
- **Missing:** Category icons, more polished styling

---

## 4. Quiz Screen (Core Screen)

**Layout:**
- **Top:** Question number (3/10), Timer, Progress bar
- **Middle:** Question card
- **Bottom:** Option buttons (A, B, C, D)

**After selecting:**
- Highlight correct/incorrect
- Next button appears

**Current Implementation:** `QuizScreen.js` ✅
- Has question number, timer, progress bar
- Has option buttons
- Has haptic feedback, scale animation
- **Missing:** Smooth slide transitions between questions, Next button appears after selection, correct/incorrect highlight

---

## 5. Result Screen

**Layout:**
- **Top:** Score display
- **Center:** Correct answers, Wrong answers, Accuracy %
- **Bottom:** Buttons: Retry, Home, Review Answers
- **Optional:** XP gained, streak update

**Current Implementation:** `ResultScreen.js` ✅
- Has score display, XP earned, new level
- Has Review Answers, Return to Home, View Leaderboard buttons
- **Missing:** Confetti celebration, animated number counting

---

## 6. Review Screen

**Purpose:** Lets user see answers

**Layout:**
- Scrollable list
- Question
- Your answer
- Correct answer
- Explanation

**Current Implementation:** `ReviewScreen.js` ✅
- Has scrollable list of questions
- Shows user's answer vs correct answer
- **Missing:** Explanation section for each question

---

## 7. Leaderboard Screen

**Layout:**
- **Top:** "Leaderboard"
- **Filter tabs:** Global | Friends | Weekly
- **List:**
  - 1 Player 980 pts
  - 2 Player 910 pts
  - 3 Player 870 pts
- **Highlight current user**

**Current Implementation:** `LeaderboardScreen.js` ✅
- Has leaderboard list with ranks
- Highlights top player
- **Missing:** Filter tabs (Global/Friends/Weekly), highlight current user

---

## 8. Stats Screen

**Layout:**
- **Top:** Profile
- **Center stats cards:**
  - Total Quizzes
  - Accuracy
  - Highest Score
  - Average Time
- **Charts:**
  - Performance graph
  - Category strengths

**Current Implementation:** `StatsScreen.js` ✅
- Has stats cards (quizzes played, wins, accuracy, best streak)
- Has performance chart, topic accuracy, difficulty performance, recent quizzes
- **Missing:** Profile section at top, Average Time stat

---

## 9. Daily Challenge Screen

**Layout:**
- **Top:** Today's challenge title
- **Center:** Challenge description
  - Example: "10 Programming Questions, Hard Difficulty, Reward: 50 XP"
- **Bottom:** Start Challenge

**Current Implementation:** `DailyChallengeScreen.js` ✅
- Has challenge details (questions, difficulty, reward)
- Has streak tracker
- Has start button
- **Missing:** More polished styling, challenge description

---

## App Navigation Flow

```
Login
   ↓
Home
 ├ Start Quiz → Category → Quiz → Result
 ├ Daily Challenge → Quiz → Result
 ├ Leaderboard
 └ Stats
```

**Current Implementation:** `AppNavigator.js` ✅
- Has all screens registered
- Navigation is functional
- **Missing:** Animation between screens

---

## Recommended Folder Structure

**screens/**
- LoginScreen.js ✅
- HomeScreen.js ✅
- CategoryScreen.js ❌ (Using TopicSelectionScreen.js)
- QuizScreen.js ✅
- ResultScreen.js ✅
- ReviewScreen.js ✅
- LeaderboardScreen.js ✅
- StatsScreen.js ✅
- DailyChallengeScreen.js ✅

**components/**
- Card.js ❌ (Not created)
- PrimaryButton.js ❌ (Not created)
- OptionButton.js ❌ (Not created)
- ProgressBar.js ❌ (Not created)
- StatBox.js ❌ (Not created)

---

## UI Style Guide (Current Theme)

**Theme Colors:**
- Background: `#0F0F11` (Dark) / `#F5F7FB` (Light)
- Surface: `#17171C` (Dark) / `#FFFFFF` (Light)
- Accent: `#6C63FF` (Purple)
- Text Primary: `#FFFFFF` (Dark) / `#1A1A1A` (Light)
- Text Secondary: `#9CA3AF` (Dark) / `#6B7280` (Light)
- Border: `#26262C` (Dark) / `#E5E7EB` (Light)
- Timer Warning: `#FF5A5F`

**Design Rules:**
- Rounded cards (borderRadius.card: 14)
- Large buttons (borderRadius.button: 12)
- Glow hover effects ❌ (Not implemented)
- Minimal clutter

---

## Missing Components to Create

1. **Card Component** - Reusable card with shadow/glow
2. **PrimaryButton Component** - Reusable gradient button
3. **OptionButton Component** - Quiz option button
4. **ProgressBar Component** - Reusable progress bar
5. **StatBox Component** - Reusable stat display box

---

## UI Enhancement Priorities

### High Priority (Quick Wins)
1. ✅ Confetti celebration on ResultScreen (Day 2)
2. ✅ Sound effects for quiz interactions (Day 2)
3. ✅ Smooth slide transitions between questions (Day 2)
4. ✅ Enhanced shadows/glow effects (Day 2)

### Medium Priority
5. ✅ Add CategoryScreen icons
6. ✅ Create reusable UI components
7. ✅ Add explanation section to ReviewScreen
8. ✅ Add filter tabs to LeaderboardScreen

### Low Priority
9. ✅ Lottie animations for complex transitions
10. ✅ Background music with volume controls

---

## Next Steps

1. Create reusable UI components (Card, Button, ProgressBar)
2. Refactor existing screens to use components
3. Add premium UI features (confetti, audio, animations)
4. Test navigation flow and animations
