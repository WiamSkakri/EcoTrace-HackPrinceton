# Sustainify 🌍

A comprehensive sustainability tracking and improvement platform that empowers users to monitor their environmental impact, compete with eco-warriors worldwide, and make informed decisions for a greener future.

## Overview

Sustainify combines real-time impact tracking, AI-powered recommendations, and community engagement to help individuals reduce their carbon footprint and adopt sustainable lifestyles. Track your progress, discover eco-friendly places, and get personalized advice from our AI assistant.

## 🌱 Features

### 1. Personal Impact Dashboard
- Real-time sustainability score tracking
- Weekly progress visualization
- Carbon footprint monitoring
- Investment credit system

### 2. Global Leaderboard
- Compete with other eco-warriors
- Track your ranking
- View sustainability achievements
- Get personalized improvement suggestions

### 3. AI-Powered Eco Assistant
- Get personalized sustainability advice
- Analyze shopping patterns
- Receive eco-friendly product recommendations
- Learn about sustainable alternatives

### 4. Sustainable Places Map
- Find eco-friendly stores and services
- Discover refill stations
- Locate zero-waste shops
- Search by category (Food, Clothing, Refill, etc.)

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Expo CLI** (installed automatically with dependencies)
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/sustainify.git
   cd sustainify
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:8081`)
   - Or scan the QR code with the Expo Go app on your mobile device

## 📱 Platform Support

- Web (Primary Platform)
- iOS (Coming Soon)
- Android (Coming Soon)

## 🛠️ Built With

- [Expo](https://expo.dev/) - The React Native framework
- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based routing
- [React Native](https://reactnative.dev/) - Cross-platform development
- [Google Gemini AI](https://ai.google.dev/) - AI-powered sustainability assistant
- [Lucide Icons](https://lucide.dev/) - Beautiful icon system
- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit) - Data visualization
- [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) - Gradient effects
- [React Native WebView](https://github.com/react-native-webview/react-native-webview) - Web content integration

## 📂 Project Structure

```
sustainify/
├── app/                    # Application routes
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── _layout.tsx    # Tab configuration
│   │   ├── index.tsx      # Impact dashboard
│   │   ├── leaderboard.tsx# Global leaderboard
│   │   ├── chat.tsx       # AI assistant
│   │   └── map.tsx        # Sustainable places
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
├── hooks/                # Custom hooks
├── lib/                  # Utility functions
├── types/                # TypeScript definitions
└── assets/              # Static assets
```

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_GEMINI_API_KEY` | Google Gemini AI API key for the sustainability assistant |

## 🎨 Design System

### Colors
- Primary: `#4ade80` (Green)
- Background: `#1a1a1a` (Dark)
- Text: `#ffffff` (White)
- Accent: `#facc15` (Yellow)
- Error: `#f87171` (Red)

### Typography
- Headings: System font, bold
- Body: System font, regular
- Scores: System font, semi-bold

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Your Name - [@yourusername](https://twitter.com/yourusername)

Project Link: [https://github.com/yourusername/sustainify](https://github.com/yourusername/sustainify)

## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com) for beautiful images
- [OpenStreetMap](https://www.openstreetmap.org) for map data
- All contributors who have helped this project grow