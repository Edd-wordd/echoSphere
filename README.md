# The Huddle

The Huddle is a private, authenticated dashboard application for managing game picks, viewing leaderboards, and interacting with game-based features. Users can make picks, track their performance, and compete on leaderboards. Administrators have access to a separate panel for managing games, weeks, users, and system settings.

## Project Overview

The Huddle provides a dashboard-style interface where authenticated users can manage their picks, view leaderboards, and participate in game-based activities. The application uses a modular structure to support ongoing backend and authentication refactoring while maintaining a consistent user experience.

## Core Features

- **User Authentication**: Sign up, sign in, password reset, and email verification
- **User Dashboard**: Personalized dashboard with user statistics and quick access to features
- **Picks Management**: Make and manage game picks
- **Leaderboard**: View rankings and compare performance with other users
- **Super Bowl Squares**: Participate in Super Bowl squares game
- **Rules**: View game rules and guidelines
- **User Settings**: Manage profile, preferences, and account settings
- **Admin Panel**: Administrative interface for managing weeks, games, users, settings, and activity logs (admin-only)

## Tech Stack

- React 18.2.0
- React Router DOM 6.23.1
- Material UI (MUI) 5.15.18
- React Scripts 5.0.1

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin panel components
│   ├── auth/           # Authentication components
│   ├── layout/         # Shared layout components
│   ├── pages/          # Main page components
│   └── user/           # User dashboard components
├── firebase/           # Backend configuration
├── hooks/              # Custom React hooks
└── styles/             # Shared styles
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository

```sh
git clone https://github.com/Edd-wordd/Echosphere.git
cd Echosphere
```

2. Install dependencies

```sh
npm install
```

3. Configure backend and authentication settings as needed

4. Start the development server

```sh
npm start
```

The application will be available at `http://localhost:3000`.

## Notes

The backend and authentication provider are being actively refactored. The project structure is intentionally modular to support this transition while maintaining functionality and code organization.

## License

Distributed under the MIT License. See `LICENSE` for more information.
