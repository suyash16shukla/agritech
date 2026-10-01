// Weather condition code → emoji map
export const weatherEmoji = (code) => {
  if (code === 0 || code === 1) return '☀️';
  if (code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 55) return '🌦️';
  if (code >= 61 && code <= 65) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌩️';
  if (code >= 95) return '⛈️';
  return '🌤️';
};

// Get task icon config based on type
export const taskTypeConfig = {
  irrigation: { icon: '💧', color: 'bg-blue-100 text-blue-700', borderColor: 'border-blue-300', label: 'Pani Dena' },
  fertilizer: { icon: '🌿', color: 'bg-green-100 text-green-700', borderColor: 'border-green-300', label: 'Khad Dalna' },
  pesticide: { icon: '🛡️', color: 'bg-yellow-100 text-yellow-700', borderColor: 'border-yellow-300', label: 'Kaida' },
  harvest: { icon: '🌾', color: 'bg-amber-100 text-amber-700', borderColor: 'border-amber-300', label: 'Katai' },
  sowing: { icon: '🌱', color: 'bg-emerald-100 text-emerald-700', borderColor: 'border-emerald-300', label: 'Buwai' },
  monitoring: { icon: '🔍', color: 'bg-purple-100 text-purple-700', borderColor: 'border-purple-300', label: 'Nirikshan' },
};

// Scheme category config
export const schemeCategoryConfig = {
  central: { label: 'Central Govt', color: 'bg-blue-100 text-blue-800', icon: '🏛️' },
  state: { label: 'State Scheme', color: 'bg-purple-100 text-purple-800', icon: '🏢' },
  insurance: { label: 'Insurance', color: 'bg-red-100 text-red-800', icon: '🛡️' },
  loan: { label: 'Loan/Credit', color: 'bg-yellow-100 text-yellow-800', icon: '💰' },
  training: { label: 'Training', color: 'bg-green-100 text-green-800', icon: '📚' },
  subsidy: { label: 'Subsidy', color: 'bg-orange-100 text-orange-800', icon: '🎯' },
};

// Season badge colors
export const seasonColors = {
  Kharif: 'bg-green-100 text-green-800',
  Rabi: 'bg-blue-100 text-blue-800',
  Zaid: 'bg-yellow-100 text-yellow-800',
};

// Indian states list
export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export const soilTypes = [
  'Alluvial', 'Black Cotton Soil', 'Clay', 'Clay Loam', 'Loamy',
  'Red Soil', 'Sandy', 'Sandy Loam', 'Silty Clay', 'Well-drained',
];

// Format currency
export const formatCurrency = (amount) =>
  `₹${Number(amount).toLocaleString('en-IN')}`;
