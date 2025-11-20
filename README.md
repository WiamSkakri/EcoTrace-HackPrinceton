
https://github.com/user-attachments/assets/3647cf5d-b88d-4682-9629-192581fa107a
# EcoTrace

A comprehensive sustainability tracking and improvement platform that empowers users to monitor their environmental impact, compete with eco-warriors worldwide, and make informed decisions for a greener future.

## Overview

EcoTrace combines real-time impact tracking, AI-powered recommendations, community engagement, and Knot API transaction integration to help individuals reduce their carbon footprint and adopt sustainable lifestyles. Track your progress, discover eco-friendly places, and get personalized advice from our AI assistant.

## Features

### 1. Personal Impact Dashboard
- Real-time sustainability score tracking
- Weekly progress visualization
- Carbon footprint monitoring
- Investment credit system
- Financial transaction summary from Knot API

### 2. Global Leaderboard
- Compete with other eco-warriors
- Track your ranking
- View sustainability achievements
- Get personalized improvement suggestions based on purchases

### 3. AI-Powered Eco Assistant
- Get personalized sustainability advice powered by OpenAI
- Analyze shopping patterns from your transactions
- Receive eco-friendly product recommendations
- Learn about sustainable alternatives

### 4. Sustainable Places Map
- Find eco-friendly stores and services near you
- Discover refill stations
- Locate zero-waste shops
- Interactive map with OpenStreetMap

### 5. Transaction Tracking
- Integration with Knot API for transaction data
- Webhook support for real-time transaction updates
- SQLite database for transaction storage
- Sustainability scoring based on brands and stores

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
- **Knot API Credentials** ([Sign up here](https://knotapi.com/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ecotrace.git
   cd ecotrace
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory (use `.env.example` as template):
   ```env
   # Knot API Credentials
   KNOT_CLIENT_ID=your_knot_client_id_here
   KNOT_CLIENT_SECRET=your_knot_client_secret_here

   # OpenAI API Key
   OPENAI_API_KEY=your_openai_api_key_here

   # Optional: Port configuration
   PORT=3000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`
   - The app will be running with all four tabs: Dashboard, Leaderboard, Eco Chat, and Map

## Testing

This project includes comprehensive test coverage for API routes, utility functions, and React components.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Test Coverage

Current test coverage includes:
- **API Routes**: Transaction handling, finance calculations, and data aggregation
- **Utility Functions**: Knot API authentication, OpenAI integration
- **React Components**: Layout, navigation, theme switching, leaderboard, and chat interface

Coverage metrics:
- Overall: ~48% code coverage
- API Routes (transactions, finance): 100%
- Knot utilities: 100%
- Layout component: 83%
- Leaderboard page: 100%
- Chat page: 86%

### Test Technologies

- [Jest](https://jestjs.io/) - Testing framework
- [React Testing Library](https://testing-library.com/react) - Component testing
- [node-mocks-http](https://www.npmjs.com/package/node-mocks-http) - API route testing

## Platform Support

- Web (Next.js)
- Mobile (Previously Expo - now web-only)

## Built With

### Frontend
- [Next.js 14](https://nextjs.org/) - React framework with server-side rendering
- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Lucide React](https://lucide.dev/) - Beautiful icon system
- [Recharts](https://recharts.org/) - Data visualization for charts
- [React Leaflet](https://react-leaflet.js.org/) - Interactive maps
- [Leaflet](https://leafletjs.com/) - Map library

### Backend
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - Serverless API endpoints
- [SQLite3](https://www.sqlite.org/) - Embedded database
- [Knot API](https://knotapi.com/) - Transaction data integration
- [OpenAI API](https://platform.openai.com/) - AI-powered assistant

## Project Structure

```
ecotrace/
├── src/
│   ├── pages/
│   │   ├── api/              # Next.js API routes
│   │   │   ├── session.ts    # Knot session creation
│   │   │   ├── sync-transactions.ts
│   │   │   ├── webhook.ts    # Knot webhook handler
│   │   │   ├── transactions.ts
│   │   │   └── finance.ts
│   │   ├── _app.tsx          # App wrapper
│   │   ├── index.tsx         # Dashboard page
│   │   ├── leaderboard.tsx   # Leaderboard page
│   │   ├── chat.tsx          # AI chat page
│   │   └── map.tsx           # Map page
│   ├── components/
│   │   └── Layout.tsx        # Main layout with navigation
│   ├── lib/
│   │   ├── db.ts            # SQLite database connection
│   │   ├── openai.ts        # OpenAI integration
│   │   └── knot.ts          # Knot API utilities
│   └── styles/
│       ├── globals.css      # Global styles
│       └── *.module.css     # Page-specific styles
├── public/
│   └── data/                # JSON data files
├── sustainability.db       # Sustainability scoring database
├── transactions.db         # Knot API transactions database
├── jest.config.js          # Jest testing configuration
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `KNOT_CLIENT_ID` | Knot API client ID for transaction integration |
| `KNOT_CLIENT_SECRET` | Knot API client secret |
| `OPENAI_API_KEY` | OpenAI API key for the sustainability assistant |
| `PORT` | Server port (default: 3000) |

## Design System

### Colors
- Primary: `#4ade80` (Green)
- Secondary: `#22c55e` (Dark Green)
- Background: `linear-gradient(135deg, #0a4d3c 0%, #1a1f2e 100%)`
- Text: `#ffffff` (White)
- Accent: `#fbbf24` (Yellow)
- Error: `#f87171` (Red)

### Typography
- Headings: System font, bold
- Body: System font, regular
- Scores: System font, semi-bold

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


