const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  localName: { type: String },
  season: { type: String, enum: ['Kharif', 'Rabi', 'Zaid'], required: true },
  soilTypes: [{ type: String }],
  states: [{ type: String }],
  duration: { type: Number }, // days
  waterRequirement: { type: String },
  avgYield: { type: String },
  mspPrice: { type: Number }, // MSP per quintal in INR
  marketPrice: { type: Number }, // avg market price per quintal
  profitMargin: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
