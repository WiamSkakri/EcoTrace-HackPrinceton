# Sustainify Setup Guide

This guide will help you set up and run the Sustainify Next.js web application.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
KNOT_CLIENT_ID=your_knot_client_id_here
KNOT_CLIENT_SECRET=your_knot_client_secret_here
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

**Getting API Keys:**
- **Knot API**: Sign up at [https://knotapi.com](https://knotapi.com)
- **Google Gemini AI**: Get your key at [https://ai.google.dev](https://ai.google.dev)

### 3. Run the Development Server

```bash
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## Features Overview

### Pages

1. **Dashboard** (`/`) - View your sustainability impact metrics
   - Carbon footprint tracking
   - Investment credits
   - Financial summary from Knot API

2. **Leaderboard** (`/leaderboard`) - Compete globally
   - See global sustainability rankings
   - Get product replacement suggestions

3. **Eco Chat** (`/chat`) - AI Assistant
   - Ask questions about your sustainability
   - Get personalized recommendations
   - Powered by Google Gemini AI

4. **Map** (`/map`) - Find sustainable places
   - Interactive map of eco-friendly locations
   - Browse sustainable businesses near you

### API Endpoints

The app includes several API routes for Knot integration:

- `GET /api/session` - Create Knot session
- `POST /api/sync-transactions` - Sync transactions from Knot
- `POST /api/webhook` - Webhook handler for new transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/finance` - Get financial summary

## Database

The app uses SQLite for data storage:

- `transactions.db` - Stores Knot API transaction data
- `sustainability.db` - Stores sustainability scores and brand/store data

These databases are automatically created when you run the app.

## Troubleshooting

### Map not displaying

Make sure you have internet connection - the map uses OpenStreetMap tiles.

### Chat not working

Verify your `NEXT_PUBLIC_GEMINI_API_KEY` is set correctly in `.env`

### API routes failing

Check that your Knot API credentials are correct in `.env`

### Module not found errors

Run `npm install` again to ensure all dependencies are installed.

## Migration from Expo

This app was converted from an Expo React Native app to Next.js. The old Expo app is in the `Wiam/` directory and can be removed if not needed.

Key changes:
- Expo → Next.js
- React Native → React web
- Expo Router → Next.js pages router
- React Native Chart Kit → Recharts
- Platform-specific code removed

## Next Steps

1. Add your actual Knot API credentials to start syncing real transactions
2. Customize the sustainability scoring logic in the database
3. Add more sustainable places to the map
4. Enhance the AI prompts for better recommendations

## Support

For issues or questions, please check the main [README.md](README.md) or create an issue on GitHub.
