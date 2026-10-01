const mongoose = require('mongoose');

const govtSchemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameHindi: { type: String },
  category: { type: String, enum: ['central', 'state', 'insurance', 'loan', 'training', 'subsidy'], required: true },
  ministry: { type: String },
  launchYear: { type: Number },
  benefitAmount: { type: String },
  eligibility: [{ type: String }],
  documents: [{ type: String }],
  applicationUrl: { type: String },
  description: { type: String },
  descriptionHindi: { type: String },
  targetStates: [{ type: String }],
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('GovtScheme', govtSchemeSchema);
