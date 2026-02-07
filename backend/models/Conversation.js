const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    userMessage: { type: String, required: true },
    aiResponse: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversation', conversationSchema);
