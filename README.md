# 🌾 Krishi Mitra — Smart Farming & Advisory Platform

A production-ready MERN stack AgriTech web application with AI-powered crop advisory, live weather, soil metrics, crop scheduling, and government scheme directory.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Gemini API Key (from [Google AI Studio](https://aistudio.google.com/app/apikey))

### 1. Clone & Setup

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Server Environment

Edit `server/.env`:
```
MONGODB_URI=mongodb://localhost:27017/krishimitra
PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Seed the Database

```bash
cd server
npm run seed
```

Expected output:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
🌾 Seeded 8 crops
📅 Seeded 3 crop schedules
📋 Seeded 8 government schemes
✨ Database seeding complete!
```

### 4. Start the Server

```bash
cd server
npm run dev    # with nodemon (auto-restart)
# OR
npm start      # production
```

Server runs at: `http://localhost:5000`

### 5. Start the Client

```bash
cd client
npm run dev
```

Client runs at: `http://localhost:5173`

---

## 📁 Project Structure

```
sih2026-main/
├── server/
│   ├── models/
│   │   ├── Crop.js              # Crop schema
│   │   ├── CropSchedule.js      # Day-wise task schedule schema
│   │   └── GovtScheme.js        # Government scheme schema
│   ├── server.js                # Express server with all API routes
│   ├── seed.js                  # Database seeder with authentic data
│   ├── .env                     # Environment variables
│   └── package.json
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navigation.jsx   # Mobile bottom nav + desktop sidebar
    │   │   ├── WeatherCard.jsx  # Live Open-Meteo weather widget
    │   │   ├── SoilMetricsCard.jsx  # NPK gauges + soil health
    │   │   ├── CropAdvisor.jsx  # Crop recommendation engine
    │   │   ├── CropTimeline.jsx # Day-wise task scheduler
    │   │   ├── GovtSchemes.jsx  # Filterable schemes directory
    │   │   └── ChatBot.jsx      # Gemini AI chatbot modal
    │   ├── utils/
    │   │   ├── api.js           # Axios API client
    │   │   └── helpers.js       # Shared utilities & constants
    │   ├── App.jsx              # Main dashboard layout
    │   ├── main.jsx             # React entry point
    │   └── index.css            # Tailwind + custom styles
    ├── index.html
    ├── vite.config.js           # Vite + API proxy config
    ├── tailwind.config.js
    └── package.json
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/weather?lat=28.6&lon=77.2&location=Delhi` | Live weather (Open-Meteo) |
| GET | `/api/crops` | All crops (filter by season, state, soilType) |
| POST | `/api/crops/recommend` | Crop recommendations by state/season/soil |
| GET | `/api/schedules?cropName=Wheat` | Day-wise crop schedule |
| GET | `/api/schemes` | Government schemes (filter by category, search) |
| POST | `/api/ai/advisor` | Gemini AI agricultural advisor |
| GET | `/api/soil/metrics` | Soil health metrics |

---

## 🎨 Features

### 📱 Mobile View
- Bottom navigation bar (Home, Crops, Weather, Tasks, Schemes, AI Mitra)
- Rounded card layout with status rings
- Touch-optimized interactions

### 🖥️ Desktop View
- Persistent left sidebar with icons
- Central telemetry dashboard with metric cards
- Full SaaS-style layout

### 🤖 AI Chatbot
- Powered by Google Gemini 2.5 Flash
- Multilingual: Hindi, Hinglish, English
- Agricultural expert system instruction
- Quick prompts for common queries

### 🌤️ Live Weather
- Open-Meteo API integration (free, no key needed)
- 7-day forecast
- Auto-location detection
- Crop advisory based on weather

### 🌾 Data
- 8 major Indian crops with MSP & market prices
- Detailed day-wise schedules for Wheat, Paddy, Mustard
- 8 government schemes (PM-KISAN, PMFBY, PM-KUSUM, etc.)

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS + Lucide React |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| AI | Google Gemini 2.5 Flash (`@google/genai`) |
| Weather | Open-Meteo API (free) |
| HTTP | Axios |

---

## 📝 Environment Variables

### Server (`server/.env`)
```
MONGODB_URI=mongodb://localhost:27017/krishimitra
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

---

*Built for SIH 2026 — Empowering Indian Farmers with Smart Technology* 🇮🇳
