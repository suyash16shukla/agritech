import React, { useState } from 'react';
import { Search, TrendingUp, Droplets, Calendar, Leaf, ChevronRight, AlertCircle } from 'lucide-react';
import { cropsAPI } from '../utils/api';
import { indianStates, soilTypes, seasonColors, formatCurrency } from '../utils/helpers';

function CropCard({ crop, onScheduleView }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden card-hover">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl flex-shrink-0">
          {crop.name === 'Wheat' ? '🌾' : crop.name === 'Paddy' ? '🌱' : crop.name === 'Mustard' ? '🌻' : crop.name === 'Cotton' ? '🌿' : crop.name === 'Sugarcane' ? '🎋' : crop.name === 'Maize' ? '🌽' : crop.name === 'Soybean' ? '🫘' : '🌾'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-gray-900 text-sm">{crop.name}</h4>
            <span className={`badge text-[10px] ${seasonColors[crop.season] || 'bg-gray-100 text-gray-700'}`}>
              {crop.season}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{crop.localName}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold text-emerald-700">{crop.profitMargin}</p>
          <p className="text-[10px] text-gray-400">profit margin</p>
        </div>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-3 gap-0 border-t border-gray-100">
        <div className="p-3 text-center border-r border-gray-100">
          <p className="text-xs font-bold text-gray-800">{formatCurrency(crop.mspPrice)}</p>
          <p className="text-[10px] text-gray-400">MSP/quintal</p>
        </div>
        <div className="p-3 text-center border-r border-gray-100">
          <p className="text-xs font-bold text-gray-800">{formatCurrency(crop.marketPrice)}</p>
          <p className="text-[10px] text-gray-400">Market price</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-xs font-bold text-gray-800">{crop.duration}d</p>
          <p className="text-[10px] text-gray-400">Duration</p>
        </div>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 animate-fade-in">
          <p className="text-xs text-gray-600 mb-3">{crop.description}</p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Droplets size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600"><span className="font-medium">Water: </span>{crop.waterRequirement}</p>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600"><span className="font-medium">Avg Yield: </span>{crop.avgYield}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-3">
            {crop.soilTypes?.slice(0, 3).map(soil => (
              <span key={soil} className="badge bg-stone-100 text-stone-700 text-[9px]">{soil}</span>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onScheduleView(crop)}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg py-2 transition-colors"
            >
              <Calendar size={12} /> View Schedule
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-2.5 text-xs text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1 border-t border-gray-100"
      >
        {expanded ? 'Show less' : 'View details'}
        <ChevronRight size={12} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>
    </div>
  );
}

export default function CropAdvisor({ onScheduleView }) {
  const [form, setForm] = useState({ state: '', season: '', soilType: '', district: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const { data } = await cropsAPI.recommend(form);
      setResults(data.data || []);
    } catch (err) {
      setError('Unable to fetch recommendations. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="p-5 border-b border-gray-100">
        <h3 className="section-title mb-1">
          <span>🎯</span> Crop Decision Advisor
        </h3>
        <p className="text-xs text-gray-500">Get profitable crop recommendations based on your region & soil</p>
      </div>

      {/* Filter Form */}
      <div className="p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
            <select
              value={form.state}
              onChange={e => setForm({ ...form, state: e.target.value })}
              className="input-field text-sm"
            >
              <option value="">All States</option>
              {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Season</label>
            <select
              value={form.season}
              onChange={e => setForm({ ...form, season: e.target.value })}
              className="input-field text-sm"
            >
              <option value="">Any Season</option>
              <option value="Kharif">Kharif (Jun–Oct)</option>
              <option value="Rabi">Rabi (Oct–Mar)</option>
              <option value="Zaid">Zaid (Mar–Jun)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Soil Type</label>
            <select
              value={form.soilType}
              onChange={e => setForm({ ...form, soilType: e.target.value })}
              className="input-field text-sm"
            >
              <option value="">Any Soil</option>
              {soilTypes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">District (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Kanpur"
              value={form.district}
              onChange={e => setForm({ ...form, district: e.target.value })}
              className="input-field text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Finding Best Crops...
            </>
          ) : (
            <>
              <Search size={16} /> Get Recommendations
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {error && (
        <div className="mx-5 mb-5 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
          <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {searched && !loading && results.length > 0 && (
        <div className="px-5 pb-5">
          <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
            <Leaf size={12} className="text-emerald-500" />
            {results.length} crops recommended for your conditions
          </p>
          <div className="space-y-3">
            {results.map(crop => (
              <CropCard key={crop._id} crop={crop} onScheduleView={onScheduleView} />
            ))}
          </div>
        </div>
      )}

      {searched && !loading && results.length === 0 && !error && (
        <div className="px-5 pb-5 text-center">
          <p className="text-sm text-gray-500">No crops found for selected filters. Try broader criteria.</p>
        </div>
      )}
    </div>
  );
}
