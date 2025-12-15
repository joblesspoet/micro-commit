# Micro-Commit 🚀

> "Success is the sum of small efforts, repeated day in and day out."

**Micro-Commit** is a React Native habit tracker built on the philosophy that starting ridiculously small is the key to building lasting habits. It focuses on <2 minute tasks, creating positive feedback loops through streaks and badges.

![App Icon](./assets/icon.png)

## ✨ key Features

### 👤 User Profile & Identity
- **Customizable Profile**: Edit your display name and upload a custom avatar.
- **Stats Dashboard**: Visualize your progress with real-time stats (Active Habits, Total Completions, Longest Streak).
- **Gamification**: Earn badges like "Early Bird" and "On Fire" as you maintain consistency.
- **Data Control**: Full export capability (JSON) and secure account deletion.

### ⚡ Habit Management
- **Smart Creation**: Validates habits to ensure they adhere to the "micro" philosophy (must be short duration).
- **Categorization**: Organize by Fitness, Learning, Mindfulness, Productivity, or Relationships.
- **Anti-Frustration**: Graceful handling of "already completed" states to prevent accidental double-logging.

### 📊 Dashboard & Tracking
- **Daily Check-ins**: Simple, one-tap completion with haptic feedback.
- **Timezone Aware**: Robust streak calculation that respects your local time (no lost streaks when traveling!).
- **Progress Visuals**: Weekly progress bars and daily indicators.

### 🔐 Authentication & Security
- **Supabase Auth**: Secure email/password login and signup.
- **Onboarding Flow**: Guided initial setup for new users.
- **Row Level Security**: Your data is protected at the database level.

---

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (via [Expo SDK 50](https://expo.dev/))
- **Language**: TypeScript
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
- **Navigation**: React Navigation (Native Stack)
- **Icons**: Ionicons (@expo/vector-icons)
- **Styling**: StyleSheet API with a centralized Theme system
- **Utilities**: `date-fns` for time, `expo-haptics` for feel.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS)
- npm or yarn
- Supabase Account

### Installation

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd micro-commit
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Database Setup**
   Run the provided SQL scripts in your Supabase SQL Editor:
   - `db_setup.sql`: Creates tables (users, habits, completions, badges).
   - `db_triggers.sql`: Sets up auto-updated timestamps.

4. **Run the App**
   ```bash
   npx expo start
   ```
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go for physical device

---

## 📂 Project Structure

```
src/
├── api/          # Supabase client configuration
├── components/   # Reusable UI components (common & feature-specific)
├── constants/    # Theme, colors, and static data
├── context/      # React Context (Auth, Habits)
├── hooks/        # Custom hooks (useProfile, useBadges, etc.)
├── navigation/   # Stack navigators (Auth, Main, Onboarding)
├── screens/      # Application screens
├── services/     # Business logic and API calls
├── types/        # TypeScript descriptions
└── utils/        # Helpers (dates, validation, storage)
```

---

## 📱 Screenshots

*(Add screenshots here)*

---

## 📄 License

This project is licensed under the MIT License.
