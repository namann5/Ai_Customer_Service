const Conversation = require('../models/Conversation');

const getRecentWrapper = async (businessId, limit = 5) => {
    try {
        const conversations = await Conversation.find({ businessId })
            .sort({ timestamp: -1 })
            .limit(limit);

        return conversations.reverse(); // Return in chronological order
    } catch (err) {
        console.error("Error fetching memory:", err);
        return [];
    }
};

module.exports = { getRecentWrapper };
