require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenAI } = require('@google/genai');

const Crop = require('./models/Crop');
const CropSchedule = require('./models/CropSchedule');
const GovtScheme = require('./models/GovtScheme');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/krishimitra';

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ─── MongoDB Connection ────────────────────────────────────────────────────────
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ─── Gemini AI Client ──────────────────────────────────────────────────────────
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const KRISHI_MITRA_SYSTEM_INSTRUCTION = `
You are "Krishi Mitra AI" — an expert Indian agricultural advisor built into the Krishi Mitra smart farming platform. You are a highly knowledgeable, bilingual (Hindi/Hinglish/English) digital friend for Indian farmers.

Your expertise covers:
- All major Indian crops: Wheat (Gehun), Paddy (Dhan), Mustard (Sarson), Cotton (Kapas), Sugarcane (Ganna), Pulses (Dal), Vegetables, Fruits
- Crop disease identification and organic/chemical remedies
- Pest management (IPM - Integrated Pest Management)
- Soil health, NPK requirements, micronutrient deficiencies
- Irrigation scheduling and water management
- Indian seasonal calendars: Kharif, Rabi, Zaid
- Government schemes: PM-KISAN, PMFBY, PM-KUSUM, KCC, SMAM
- MSP (Minimum Support Prices) and market price guidance
- Post-harvest storage and value addition

Communication style:
- Be warm, patient, and supportive like a trusted village advisor (sarpanch/krishi sevak)
- Use simple Hindi/Hinglish mixed with English where needed. Example: "Aapki sarson mein yellow mosaic virus ke symptoms dikh rahe hain..."
- Use local terms: "pani dena" for irrigation, "khad dalna" for fertilizer, "kaida" for pesticide
- Provide practical, actionable advice that small farmers can implement with local resources
- When recommending chemicals, always mention generic names AND trade names
- Always mention cost-effective organic alternatives where possible
- Be encouraging and empathetic to farmers' hardships

Format responses:
- Use bullet points for steps
- Keep paragraphs short
- Use emoji sparingly but meaningfully (🌱🌾💧🐛)
- For disease/pest queries, always include: Symptoms → Cause → Prevention → Cure
`;

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Krishi Mitra Server Running 🌾', timestamp: new Date().toISOString() });
});

// ─── Weather Proxy (Open-Meteo) ────────────────────────────────────────────────
app.get('/api/weather', async (req, res) => {
  try {
    const { lat = 28.6139, lon = 77.2090, location = 'Delhi' } = req.query;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=Asia%2FKolkata&forecast_days=7`;

    const response = await axios.get(weatherUrl);
    const data = response.data;

    const weatherCodeMap = {
      0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Icy Fog', 51: 'Light Drizzle', 53: 'Moderate Drizzle',
      55: 'Dense Drizzle', 61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
      71: 'Slight Snow', 73: 'Moderate Snow', 75: 'Heavy Snow', 77: 'Snow Grains',
      80: 'Slight Showers', 81: 'Moderate Showers', 82: 'Violent Showers',
      85: 'Slight Snow Showers', 86: 'Heavy Snow Showers',
      95: 'Thunderstorm', 96: 'Thunderstorm + Hail', 99: 'Thunderstorm + Heavy Hail',
    };

    const current = data.current;
    const daily = data.daily;

    res.json({
      location,
      current: {
        temperature: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        precipitation: current.precipitation,
        condition: weatherCodeMap[current.weather_code] || 'Unknown',
        weatherCode: current.weather_code,
      },
      forecast: daily.time.slice(0, 7).map((date, i) => ({
        date,
        maxTemp: Math.round(daily.temperature_2m_max[i]),
        minTemp: Math.round(daily.temperature_2m_min[i]),
        precipitation: daily.precipitation_sum[i],
        condition: weatherCodeMap[daily.weather_code[i]] || 'Unknown',
        weatherCode: daily.weather_code[i],
      })),
    });
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ error: 'Weather data fetch failed', message: error.message });
  }
});

// ─── Crop Routes ───────────────────────────────────────────────────────────────
// GET all crops
app.get('/api/crops', async (req, res) => {
  try {
    const { season, state, soilType } = req.query;
    const filter = {};
    if (season) filter.season = season;
    if (state) filter.states = { $in: [state] };
    if (soilType) filter.soilTypes = { $in: [soilType] };

    const crops = await Crop.find(filter).sort({ profitMargin: -1 });
    res.json({ success: true, count: crops.length, data: crops });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single crop
app.get('/api/crops/:id', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ success: false, error: 'Crop not found' });
    res.json({ success: true, data: crop });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Crop Recommendation Engine
app.post('/api/crops/recommend', async (req, res) => {
  try {
    const { state, district, soilType, season, budget } = req.body;

    const filter = {};
    if (season) filter.season = season;
    if (state) filter.states = { $in: [state] };
    if (soilType) filter.soilTypes = { $regex: soilType, $options: 'i' };

    let crops = await Crop.find(filter).limit(5);

    // Fallback: if no match, return top crops for season
    if (crops.length === 0 && season) {
      crops = await Crop.find({ season }).limit(5);
    }
    if (crops.length === 0) {
      crops = await Crop.find({}).limit(5);
    }

    const recommendations = crops.map(crop => ({
      _id: crop._id,
      name: crop.name,
      localName: crop.localName,
      season: crop.season,
      duration: crop.duration,
      mspPrice: crop.mspPrice,
      marketPrice: crop.marketPrice,
      profitMargin: crop.profitMargin,
      avgYield: crop.avgYield,
      waterRequirement: crop.waterRequirement,
      soilTypes: crop.soilTypes,
      description: crop.description,
      tags: crop.tags,
      estimatedRevenue: `₹${(crop.marketPrice * 20).toLocaleString('en-IN')}/hectare (approx)`,
    }));

    res.json({
      success: true,
      query: { state, district, soilType, season },
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Crop Schedule Routes ──────────────────────────────────────────────────────
// GET schedule by crop name
app.get('/api/schedules', async (req, res) => {
  try {
    const { cropName } = req.query;
    const filter = cropName ? { cropName: { $regex: cropName, $options: 'i' } } : {};
    const schedules = await CropSchedule.find(filter).populate('cropId');
    res.json({ success: true, count: schedules.length, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET schedule by crop ID
app.get('/api/schedules/crop/:cropId', async (req, res) => {
  try {
    const schedule = await CropSchedule.findOne({ cropId: req.params.cropId }).populate('cropId');
    if (!schedule) return res.status(404).json({ success: false, error: 'Schedule not found' });
    res.json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Government Schemes Routes ─────────────────────────────────────────────────
app.get('/api/schemes', async (req, res) => {
  try {
    const { category, tag, search } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [search.toLowerCase()] } },
      ];
    }

    const schemes = await GovtScheme.find(filter).sort({ launchYear: -1 });
    res.json({ success: true, count: schemes.length, data: schemes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/schemes/:id', async (req, res) => {
  try {
    const scheme = await GovtScheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, error: 'Scheme not found' });
    res.json({ success: true, data: scheme });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Gemini AI Advisory Endpoint ───────────────────────────────────────────────
app.post('/api/ai/advisor', async (req, res) => {
  try {
    const { message, language = 'hinglish', conversationHistory = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(503).json({
        success: false,
        error: 'AI service not configured',
        message: 'Gemini API key not set. Please add GEMINI_API_KEY to your .env file.',
      });
    }

    // Build conversation history for context
    const history = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const languageInstruction = {
      hindi: 'Respond entirely in Hindi (Devanagari script).',
      english: 'Respond entirely in English.',
      hinglish: 'Respond in Hinglish - a natural mix of Hindi and English as spoken in rural India.',
    }[language] || 'Respond in Hinglish.';

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: KRISHI_MITRA_SYSTEM_INSTRUCTION + `\n\nLanguage instruction: ${languageInstruction}`,
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.json({
      success: true,
      response: responseText,
      language,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Gemini AI error:', error.message);
    res.status(500).json({
      success: false,
      error: 'AI advisor unavailable',
      message: error.message,
    });
  }
});

// ─── Soil Analysis Mock Endpoint ───────────────────────────────────────────────
app.get('/api/soil/metrics', (req, res) => {
  // Returns realistic soil metric ranges for demonstration
  const metrics = {
    nitrogen: { value: Math.floor(Math.random() * 40) + 180, unit: 'kg/ha', status: 'medium', label: 'Nitrogen (N)' },
    phosphorus: { value: Math.floor(Math.random() * 15) + 20, unit: 'kg/ha', status: 'low', label: 'Phosphorus (P)' },
    potassium: { value: Math.floor(Math.random() * 50) + 200, unit: 'kg/ha', status: 'high', label: 'Potassium (K)' },
    ph: { value: (Math.random() * 1.5 + 6.0).toFixed(1), unit: 'pH', status: 'optimal', label: 'Soil pH' },
    moisture: { value: Math.floor(Math.random() * 20) + 35, unit: '%', status: 'adequate', label: 'Soil Moisture' },
    organicMatter: { value: (Math.random() * 1.5 + 1.0).toFixed(1), unit: '%', status: 'low', label: 'Organic Matter' },
  };

  const recommendations = [];
  if (metrics.phosphorus.status === 'low') recommendations.push('Apply DAP (Di-ammonium Phosphate) 100 kg/ha before sowing');
  if (parseFloat(metrics.ph.value) > 7.5) recommendations.push('Soil is alkaline - apply Gypsum 250 kg/ha to reduce pH');
  if (parseFloat(metrics.organicMatter.value) < 1.5) recommendations.push('Add FYM (Farm Yard Manure) or vermicompost to improve organic matter');

  res.json({ success: true, data: metrics, recommendations });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌾 Krishi Mitra Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/weather?lat=28.6&lon=77.2&location=Delhi`);
  console.log(`   GET  /api/crops`);
  console.log(`   POST /api/crops/recommend`);
  console.log(`   GET  /api/schedules?cropName=Wheat`);
  console.log(`   GET  /api/schemes`);
  console.log(`   POST /api/ai/advisor`);
  console.log(`   GET  /api/soil/metrics\n`);
});
