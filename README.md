# UrbanLink

A centralized web-based municipal services management system for Mbombela Municipality.

## Overview

UrbanLink lets residents report issues, routes requests to the correct department, tracks progress, sends automatic updates, and records every action for accountability. One platform for residents, staff, and managers.

## Features

- **Issue Reporting**: Residents can easily report municipal issues
- **Intelligent Routing**: Automatically routes requests to the correct department
- **Progress Tracking**: Real-time tracking of issue resolution progress
- **Automatic Updates**: Residents receive automatic status updates
- **Full Accountability**: Complete audit trail of all actions

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/siphosethuphilili-sudo/UrbanLink.git
cd UrbanLink
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env.local` file with your Firebase credentials:
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Development

Start the development server:
```bash
npm run dev
```

### Building

Build for production:
```bash
npm run build
```

### Linting and Type Checking

Run linting:
```bash
npm run lint
```

Run type checks:
```bash
npm run typecheck
```

### Database Seeding

To seed the database with sample data:
```bash
npm run seed
```

## Project Structure

- `src/`: Frontend application source
- `src/api/base44Client.js`: Firebase client configuration
- `vite.config.js`: Vite configuration
- `.env.local`: Local environment variables (never commit)

## Technology Stack

- **Frontend**: JavaScript/TypeScript, Vite
- **Backend**: Firebase (Firestore + Authentication)
- **Deployment**: GitHub Pages

## License

See LICENSE file for details.

## Support

For issues and feature requests, please create an issue on GitHub.
