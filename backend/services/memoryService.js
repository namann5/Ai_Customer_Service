/**
 * Memory Service
 * Fetches recent conversations for context in AI prompts.
 * Helps AI maintain continuity in multi-turn chats.
 */
const Conversation = require('../models/Conversation');

/**
 * Get recent conversations for a business (chronological order)
 * @param {string} businessId - MongoDB ObjectId
 * @param {number} limit - Max conversations to return (default 5)
 */
const getRecentConversations = async (businessId, limit = 5) => {
    try {
        const conversations = await Conversation.find({ business_id: businessId })
            .sort({ timestamp: -1 })
            .limit(limit)
            .lean();

        return conversations.reverse();
    } catch (err) {
        console.error('Error fetching recent conversations:', err);
        return [];
    }
};

module.exports = { getRecentConversations };
