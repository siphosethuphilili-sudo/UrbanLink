# UrbanLink

A centralized web-based municipal services management system for Mbombela Municipality.

## Overview

UrbanLink lets residents report issues, routes requests to the correct department, tracks progress, sends automatic updates, and records every action for accountability.

## Features

- **Issue Reporting**: Report municipal issues easily
- **Intelligent Routing**: Requests routed to correct departments
- **Progress Tracking**: Real-time issue tracking
- **Automatic Updates**: Status notifications
- **Full Accountability**: Complete audit trail

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/siphosethuphilili-sudo/UrbanLink.git
cd UrbanLink
npm install
cp .env.example .env.local
```

### Configuration

Edit `.env.local` with your Firebase credentials:
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter
- `npm run typecheck` - Type checking

## Project Structure

```
src/
├── components/       # Components
├── pages/           # Page components
├── context/         # Context providers
├── App.jsx          # Main component
├── main.jsx         # Entry point
└── index.css        # Styles
```

## Technology Stack

- React 18
- React Router
- Firebase
- Vite
- Tailwind CSS
- TypeScript

## Deployment

Deployed to GitHub Pages via GitHub Actions.

**Live URL**: https://siphosethuphilili-sudo.github.io/UrbanLink/

## License

MIT
