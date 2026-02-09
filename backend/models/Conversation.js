/**
 * Conversation Model
 * Logs every customer-AI interaction for audit and metrics.
 * Used for compliance, debugging, and improving responses.
 */
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    user_message: { type: String, required: true },
    ai_response: { type: String, required: true },
    confidence_score: { type: Number, default: 0 }, // 0-1, from AI or fallback logic
    escalated_to_human: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

// Index for faster lookups by business
conversationSchema.index({ business_id: 1, timestamp: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);
