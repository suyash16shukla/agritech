import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Wind, Droplets, Thermometer, RefreshCw, CloudRain, Eye } from 'lucide-react';
import { weatherAPI } from '../utils/api';
import { weatherEmoji } from '../utils/helpers';

const POPULAR_LOCATIONS = [
  { name: 'Delhi', lat: 28.6139, lon: 77.2090 },
  { name: 'Lucknow', lat: 26.8467, lon: 80.9462 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567 },
  { name: 'Bhopal', lat: 23.2599, lon: 77.4126 },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
  { name: 'Patna', lat: 25.5941, lon: 85.1376 },
  { name: 'Chandigarh', lat: 30.7333, lon: 76.7794 },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
];

function WeatherIcon({ code, size = 'large' }) {
  const emoji = weatherEmoji(code);
  return (
    <span className={size === 'large' ? 'text-6xl' : 'text-2xl'} role="img" aria-label="weather">
      {emoji}
    </span>
  );
}

function ForecastDay({ day }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-white/60 backdrop-blur-sm rounded-xl p-2.5 min-w-[70px]">
      <p className="text-[10px] text-gray-500 font-medium">
        {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short' })}
      </p>
      <WeatherIcon code={day.weatherCode} size="small" />
      <p className="text-xs font-bold text-gray-800">{day.maxTemp}°</p>
      <p className="text-[10px] text-gray-500">{day.minTemp}°</p>
      {day.precipitation > 0 && (
        <div className="flex items-center gap-0.5">
          <CloudRain size={9} className="text-blue-500" />
          <span className="text-[9px] text-blue-600">{day.precipitation}mm</span>
        </div>
      )}
    </div>
  );
}

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(POPULAR_LOCATIONS[0]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await weatherAPI.get(
        selectedLocation.lat,
        selectedLocation.lon,
        selectedLocation.name
      );
      setWeather(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Weather data unavailable. Check server connection.');
    } finally {
      setLoading(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000); // refresh every 10 min
    return () => clearInterval(interval);
  }, [fetchWeather]);

  // Try geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setSelectedLocation({
            name: 'Your Location',
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        () => { /* use default */ }
      );
    }
  }, []);

  if (loading) {
    return (
      <div className="card p-5 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-16 bg-gray-200 rounded mb-3" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-5 bg-red-50 border-red-200">
        <p className="text-red-600 text-sm">{error}</p>
        <button onClick={fetchWeather} className="btn-primary mt-3 text-sm py-2">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* Header gradient */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-5 text-white relative">
        {/* Location selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="opacity-80" />
            <select
              value={selectedLocation.name}
              onChange={(e) => {
                const loc = POPULAR_LOCATIONS.find(l => l.name === e.target.value);
                if (loc) setSelectedLocation(loc);
              }}
              className="bg-transparent text-white text-sm font-semibold outline-none cursor-pointer appearance-none"
            >
              {POPULAR_LOCATIONS.map(loc => (
                <option key={loc.name} value={loc.name} className="text-gray-800">
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchWeather}
            className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            title="Refresh weather"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Main temp display */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-start gap-1">
              <span className="text-5xl font-bold leading-none">{weather.current.temperature}</span>
              <span className="text-xl mt-1">°C</span>
            </div>
            <p className="text-emerald-100 text-sm mt-1">{weather.current.condition}</p>
            <p className="text-emerald-200 text-xs mt-0.5">Feels like {weather.current.feelsLike}°C</p>
          </div>
          <WeatherIcon code={weather.current.weatherCode} size="large" />
        </div>

        {/* Stats row */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center gap-1.5">
            <Droplets size={14} className="text-blue-200" />
            <span className="text-xs text-white/90">{weather.current.humidity}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind size={14} className="text-blue-200" />
            <span className="text-xs text-white/90">{weather.current.windSpeed} km/h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CloudRain size={14} className="text-blue-200" />
            <span className="text-xs text-white/90">{weather.current.precipitation}mm</span>
          </div>
        </div>
      </div>

      {/* 7-day forecast */}
      <div className="p-4">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">7-Day Forecast</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {weather.forecast?.map((day, i) => (
            <ForecastDay key={i} day={day} />
          ))}
        </div>
        {lastUpdated && (
          <p className="text-[10px] text-gray-400 mt-3 text-right">
            Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}
