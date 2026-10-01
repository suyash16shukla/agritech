# 🌾 Krishi Mitra — Smart Precision Farming & Advisory Platform

A production-ready MERN stack AgriTech web application with AI-powered crop advisory, live GPS weather telemetry, soil metrics, crop scheduling, government scheme directory, and verified farmer registry.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Gemini API Key (from [Google AI Studio](https://aistudio.google.com/app/apikey))

### 1. Configure Server Environment

Edit `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/krishimitra
PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 2. Seed the Database

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

### 3. Start the Server & Client

```bash
# Terminal 1 — Backend (Port 5000)
cd server
npm start

# Terminal 2 — Frontend (Port 5173)
cd client
npm run dev
```

Visit: `http://localhost:5173`

---

## 📁 Upgraded Project Structure

```
sih2026-main/
├── server/
│   ├── models/
│   │   ├── Crop.js              # Crop schema
│   │   ├── CropSchedule.js      # Day-wise task schedule schema
│   │   ├── GovtScheme.js        # Government scheme schema
│   │   └── Farmer.js            # Farmer registry & farm profile schema
│   ├── server.js                # Express server with Gemini 2.5 Flash & live telemetry
│   ├── seed.js                  # Authentic Indian crop & scheme data seeder
│   └── package.json
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navigation.jsx       # Mobile bottom nav + interactive sidebar
    │   │   ├── WeatherCard.jsx      # Live GPS weather with reverse geocoding & rain %
    │   │   ├── SoilMetricsCard.jsx  # SVG circular NPK gauges & soil health
    │   │   ├── CropAdvisor.jsx      # Crop recommendation engine
    │   │   ├── CropTimeline.jsx     # Day-wise irrigation & fertilizer timeline
    │   │   ├── GovtSchemes.jsx      # Filterable schemes directory
    │   │   ├── FarmerProfile.jsx    # Kisan Dashboard & registration modal
    │   │   └── ChatBot.jsx          # Multilingual Gemini AI chatbot modal
    │   ├── utils/
    │   │   ├── api.js               # Centralized Axios API client
    │   │   ├── helpers.js           # Shared utilities & constants
    │   │   └── translations.js      # English / हिंदी / Hinglish dictionary
    │   ├── App.jsx                  # Main dashboard orchestrator
    │   ├── main.jsx                 # React entry point
    │   └── index.css                # Tailwind + precision farming styles
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🌟 Upgraded Highlights

1. **Gemini 2.5 Flash AI Engine**:
   - Fixed `genAI.models.generateContent` invocation using `@google/genai`.
   - Backup integration with `@google/generative-ai` (`gemini-1.5-flash`).
   - Localized agricultural expert fallback so queries in Hindi, Hinglish, or English are answered reliably.

2. **Accurate GPS & Live Weather (Open-Meteo)**:
   - Browser `navigator.geolocation.getCurrentPosition` auto-detects accurate latitude and longitude.
   - Reverse geocoding resolves real city/district/state names (e.g. *Varanasi, Uttar Pradesh*).
   - Real-time temperature, humidity, wind speed, and rain probability %.
   - Resilient 503 fallback so the weather tab never crashes.

3. **Global Multilingual Support**:
   - Prominent language switcher in the header for **English**, **हिंदी (Hindi)**, and **Hinglish**.
   - Persisted across reloads in `localStorage`.
   - Syncs headers, tabs, schemes, farmer registry, and chatbot prompts.

4. **Kisan Dashboard & Farmer Registration**:
   - Interactive profile card in the sidebar and mobile bottom bar.
   - Modal for Farmer Name, Phone/WhatsApp, State, District (GPS auto-filled), Land Acreage, Primary Crops, and Soil Type.
   - Saves to MongoDB (`POST /api/farmers`) and `localStorage`.
   - Dedicated "Kisan Dashboard" overview with personalized precision crop advisories and matched government welfare schemes.

5. **Seamless Navigation**:
   - Zero-reload switching between Home, Crops, Weather, Tasks, Schemes, and Kisan Dashboard.
