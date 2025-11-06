# Cric75 – Modern Cricket Scoring Platform

Cric75 is a full-stack scoring suite inspired by Cricheroes, built with the latest Next.js App Router stack. Capture ball-by-ball data, manage squads, and share real-time dashboards backed by Firebase and Socket.io infrastructure.

## Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS 4 + HeroUI design system
- Firebase Authentication, Firestore, Storage
- Zustand state management
- React Hook Form + Zod validation
- Socket.io client for realtime presence
- React Hot Toast notifications

## Features

- Email/password authentication with Firestore user profiles
- Team CRUD with player roster management
- Match creation (match type, overs, toss, teams)
- Live scoring interface with batting/bowling stats, extras, wickets
- Auto-updating match timeline and over tracker
- My Matches dashboard with edit/continue controls
- Public read-only scoreboard page for spectators
- Responsive dashboard layout with dark/light theming

## Getting Started

### 1. Configure environment variables

Create `.env.local` at the project root:

```bash
cp .env.example .env.local
```

Fill in your Firebase web app configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=__REQUIRED__
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=__REQUIRED__
NEXT_PUBLIC_FIREBASE_PROJECT_ID=__REQUIRED__
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=__REQUIRED__
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=__REQUIRED__
NEXT_PUBLIC_FIREBASE_APP_ID=__REQUIRED__
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_SOCKET_URL=https://your-socket-host.example.com
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false
```

> Tip: set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` while developing against the Firebase Emulator Suite (auth:9099, firestore:8080, storage:9199).

### 2. Install dependencies & run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 to access the marketing site. Sign in or register to enter the Cric75 dashboard.

### 3. Firebase setup checklist

- Enable **Email/Password** auth provider
- Create Firestore database in production mode
- Upload the security rules from `firebase.rules.json` (see snippet below)
- Configure Firebase Storage bucket (for future player photos)

```bash
firebase deploy --only firestore:rules
```

Recommended Firestore security rules:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /teams/{teamId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }

    match /matches/{matchId} {
      allow read: if true; // public scoreboard
      allow write: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Project structure

```
src/
  app/                # App Router routes (auth, dashboard, public match view)
  components/         # HeroUI components, layout, providers
  hooks/              # Firebase/Zustand hooks (auth, teams, matches, match)
  lib/                # Firebase client, utilities, validators
  store/              # Zustand stores (auth, teams, matches, match scoring)
  types/              # Shared TypeScript interfaces
```

## Deployment

### Deploy to Vercel

1. Push the repository to Git
2. Create a Vercel project and import the repository
3. Add the environment variables from `.env.local`
4. Deploy (Vercel auto-detects Next.js + App Router)

### Deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## Testing checklist

- [ ] Create account, update profile image + bio
- [ ] Create teams with player roster
- [ ] Start a match, set strike/bowler, record runs/extras/wickets
- [ ] Verify timeline updates and live scoreboard on public URL
- [ ] Resume match from My Matches list

## License

MIT © Cric75
