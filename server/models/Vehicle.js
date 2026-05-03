const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['car', 'bike', 'auto', 'taxi', 'truck', 'tractor', 'jcb', 'crane', 'tempo'],
    required: true
  },
  purpose: {
    type: String,
    enum: ['travelling', 'luggage', 'towing', 'farming', 'construction', 'other'],
    required: true
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  location: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);