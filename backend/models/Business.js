/**
 * Business Model
 * Stores onboarding data for each MSME (clinic, salon, kirana, etc.)
 * Used to build dynamic AI prompts and personalize responses.
 */
const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    business_name: { type: String, required: true },
    business_type: { type: String, required: true }, // clinic, salon, kirana, coaching, etc.
    phone: { type: String, required: true },
    working_hours: { type: String, required: true }, // e.g. "10 AM - 8 PM"
    services: [{ type: String }], // Array of services offered
    appointment_required: { type: Boolean, default: false },
    human_fallback: { type: Boolean, default: true }, // Allow escalation to human
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Business', businessSchema);
