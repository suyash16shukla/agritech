const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  week: { type: Number },
  title: { type: String, required: true },
  titleHindi: { type: String },
  description: { type: String },
  type: { type: String, enum: ['irrigation', 'fertilizer', 'pesticide', 'harvest', 'sowing', 'monitoring'], required: true },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
});

const cropScheduleSchema = new mongoose.Schema({
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  cropName: { type: String, required: true },
  totalDays: { type: Number, required: true },
  stages: [{
    stageName: { type: String },
    stageNameHindi: { type: String },
    startDay: { type: Number },
    endDay: { type: Number },
    color: { type: String },
    tasks: [taskSchema],
  }],
}, { timestamps: true });

module.exports = mongoose.model('CropSchedule', cropScheduleSchema);
