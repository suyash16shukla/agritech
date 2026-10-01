import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { soilAPI } from '../utils/api';

function CircularGauge({ value, max, label, unit, color, size = 80 }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const dashOffset = circumference * (1 - progress);

  const colorMap = {
    emerald: { stroke: '#059669', track: '#d1fae5', text: 'text-emerald-700' },
    blue: { stroke: '#2563eb', track: '#dbeafe', text: 'text-blue-700' },
    amber: { stroke: '#d97706', track: '#fef3c7', text: 'text-amber-700' },
    purple: { stroke: '#7c3aed', track: '#ede9fe', text: 'text-purple-700' },
    red: { stroke: '#dc2626', track: '#fee2e2', text: 'text-red-700' },
    teal: { stroke: '#0d9488', track: '#ccfbf1', text: 'text-teal-700' },
  };

  const c = colorMap[color] || colorMap.emerald;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={c.track}
            strokeWidth="8"
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={c.stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="ring-progress transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-sm font-bold ${c.text}`}>{value}</span>
          <span className="text-[9px] text-gray-400">{unit}</span>
        </div>
      </div>
      <p className="text-xs text-gray-600 font-medium text-center leading-tight">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    optimal: { class: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={10} />, label: 'Optimal' },
    high: { class: 'bg-green-100 text-green-700', icon: <TrendingUp size={10} />, label: 'High' },
    medium: { class: 'bg-yellow-100 text-yellow-700', icon: <Info size={10} />, label: 'Medium' },
    low: { class: 'bg-red-100 text-red-700', icon: <AlertCircle size={10} />, label: 'Low' },
    adequate: { class: 'bg-blue-100 text-blue-700', icon: <CheckCircle size={10} />, label: 'Adequate' },
  };
  const cfg = config[status] || config.medium;
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${cfg.class}`}>
      {cfg.icon}{cfg.label}
    </span>
  );
}

function MetricBar({ label, value, unit, status, color }) {
  const maxValues = { 'kg/ha': 400, '%': 100 };
  const max = maxValues[unit] || 100;
  const pct = Math.min((value / max) * 100, 100);

  const colorMap = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-500',
    teal: 'bg-teal-500',
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-28 flex-shrink-0">
        <p className="text-xs font-medium text-gray-700 truncate">{label}</p>
        <StatusBadge status={status} />
      </div>
      <div className="flex-1">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${colorMap[color] || 'bg-emerald-500'} transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="w-16 text-right flex-shrink-0">
        <span className="text-xs font-bold text-gray-800">{value}</span>
        <span className="text-[10px] text-gray-400 ml-0.5">{unit}</span>
      </div>
    </div>
  );
}

export default function SoilMetricsCard() {
  const [metrics, setMetrics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const { data } = await soilAPI.getMetrics();
      setMetrics(data.data);
      setRecommendations(data.recommendations);
    } catch {
      // Use fallback static data
      setMetrics({
        nitrogen: { value: 210, unit: 'kg/ha', status: 'medium', label: 'Nitrogen (N)' },
        phosphorus: { value: 22, unit: 'kg/ha', status: 'low', label: 'Phosphorus (P)' },
        potassium: { value: 240, unit: 'kg/ha', status: 'high', label: 'Potassium (K)' },
        ph: { value: '6.8', unit: 'pH', status: 'optimal', label: 'Soil pH' },
        moisture: { value: 42, unit: '%', status: 'adequate', label: 'Soil Moisture' },
        organicMatter: { value: '1.2', unit: '%', status: 'low', label: 'Organic Matter' },
      });
      setRecommendations(['Apply DAP 100 kg/ha before sowing for low phosphorus']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMetrics(); }, []);

  if (loading) {
    return (
      <div className="card p-5 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="flex gap-4 mb-4">
          {[...Array(3)].map((_, i) => <div key={i} className="w-20 h-20 bg-gray-200 rounded-full" />)}
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <div key={i} className="h-3 bg-gray-200 rounded" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title">
          <span>🌍</span> Soil Health Metrics
        </h3>
        <button
          onClick={fetchMetrics}
          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* NPK Circular Gauges */}
      <div className="flex justify-around mb-5">
        <CircularGauge
          value={metrics.nitrogen.value}
          max={400}
          label="Nitrogen"
          unit="kg/ha"
          color="emerald"
        />
        <CircularGauge
          value={metrics.phosphorus.value}
          max={100}
          label="Phosphorus"
          unit="kg/ha"
          color="amber"
        />
        <CircularGauge
          value={metrics.potassium.value}
          max={400}
          label="Potassium"
          unit="kg/ha"
          color="purple"
        />
      </div>

      {/* Other metrics as bars */}
      <div className="space-y-3 border-t border-gray-100 pt-4">
        <MetricBar
          label="Soil pH"
          value={metrics.ph.value}
          unit="pH"
          status={metrics.ph.status}
          color="teal"
        />
        <MetricBar
          label="Moisture"
          value={metrics.moisture.value}
          unit="%"
          status={metrics.moisture.status}
          color="blue"
        />
        <MetricBar
          label="Organic Matter"
          value={parseFloat(metrics.organicMatter.value) * 10}
          unit="%"
          status={metrics.organicMatter.status}
          color="amber"
        />
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
            <AlertCircle size={12} className="text-amber-500" /> Recommendations
          </p>
          <ul className="space-y-1.5">
            {recommendations.map((rec, i) => (
              <li key={i} className="text-xs text-gray-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
