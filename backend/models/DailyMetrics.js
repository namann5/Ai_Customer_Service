/**
 * DailyMetrics Model
 * Aggregated stats per business per day.
 * Used for dashboards, reporting, and government funding demos.
 */
const mongoose = require('mongoose');

const dailyMetricsSchema = new mongoose.Schema({
    business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    total_queries: { type: Number, default: 0 },
    human_escalations: { type: Number, default: 0 },
    estimated_leads: { type: Number, default: 0 }, // Queries that indicate intent
    created_at: { type: Date, default: Date.now }
});

// Unique per business per day
dailyMetricsSchema.index({ business_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyMetrics', dailyMetricsSchema);
