const mongoose = require('mongoose');

const dailyMetricSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    date: { type: String, required: true }, // Store as YYYY-MM-DD
    callsHandled: { type: Number, default: 0 },
    leadsGenerated: { type: Number, default: 0 },
    bookingsConfirmed: { type: Number, default: 0 },
    estimatedRevenue: { type: Number, default: 0 }
});

module.exports = mongoose.model('DailyMetric', dailyMetricSchema);
