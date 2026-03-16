# MINDFORGE - Development Roadmap

## ✅ Completed Milestones

### 🎨 Phase 1: The Modern Dark Theme Overhaul
*Goal: Transform the app into a premium, focused learning environment.*
- [x] **DeepWorkR Aesthetic**: Implemented a layered dark theme with `#0B1220` backgrounds.
- [x] **Subtle Modernism**: Replaced heavy shadows with thin, clean borders.
- [x] **Unified Accents**: Global purple accent system (`#7C3AED`) with soft glows.
- [x] **Component Alignment**: Updated `Card`, `PrimaryButton`, `OptionButton`, and `ProgressBar`.

### 🏗️ Phase 2: Core App Structure (12 Screens)
*Goal: Establish the full user journey and navigation flow.*
- [x] **Navigation Registry**: All 12 pages registered in `AppNavigator.js`.
- [x] **Settings Hub**: New screen for persistent Dark Mode, Haptics, and Sound toggles.
- [x] **Social Foundation**: Integrated the `FriendsScreen.js` (mock).
- [x] **Haptic Integration**: Respect haptic settings in `QuizScreen` and `ResultScreen`.

---

## 🚀 Next Sessions: The Growth & Retention Phase

### Session 1: Engagement & Streaks
- [ ] **Streak Logic (Backend)**: Update `User` model to track `lastDailyPlayDate` and calculate `dailyStreak`.
- [ ] **XP Multipliers**: Implement logic in `quizRoutes.js` to reward users with XP boosts (1.2x, 1.5x) based on their current streak.
- [ ] **Streak Dashboard**: Add a visual streak indicator (flame icon) to the `HomeScreen`.

### Session 2: Advanced Analytics
- [ ] **Granular Stats**: Modify backend to track accuracy per topic and per difficulty (documented in `Attempt`).
- [ ] **Historical Charts**: Integrate `react-native-chart-kit` or similar to show performance trends over time in `StatsScreen.js`.

### Session 3: Social & Multiplayer (Alpha)
- [ ] **Friend Infrastructure**: Implement Friend Request logic in the backend.
- [ ] **Live Challenges**: Research Socket.io integration for real-time competitive quizzes.
