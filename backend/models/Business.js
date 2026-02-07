const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    phone: { type: String, required: true },
    hours: { type: String, required: true },
    services: { type: String, required: true }, // Store as string for MVP simplicity
    appointmentRequired: { type: Boolean, default: false },
    humanFallback: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Business', businessSchema);
