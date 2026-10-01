const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  acreage: { type: Number, required: true, min: 0.1 },
  crops: [{ type: String }],
  soilType: { type: String, required: true },
  irrigationType: { type: String, default: 'Canal / Borewell' },
  preferredLanguage: { type: String, default: 'hinglish' },
}, { timestamps: true });

module.exports = mongoose.model('Farmer', farmerSchema);
