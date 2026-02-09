/**
 * Chat Controller
 * Handles customer queries, AI processing, and conversation logging.
 * POST /api/chat - Process user message, return AI response
 */
const Business = require('../models/Business');
const Conversation = require('../models/Conversation');
const DailyMetrics = require('../models/DailyMetrics');
const aiService = require('../services/aiService');
const fallbackService = require('../services/fallbackService');
const memoryService = require('../services/memoryService');

/**
 * @desc    Process chat message and return AI response
 * @route   POST /api/chat
 * @body    { business_id, user_message }
 */
exports.chat = async (req, res) => {
    try {
        const { business_id, user_message } = req.body;

        if (!business_id || !user_message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: business_id, user_message'
            });
        }

        // 1. Fetch business context
        const business = await Business.findById(business_id);
        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }

        // 2. Get recent conversation history (for context)
        const recentHistory = await memoryService.getRecentConversations(business_id, 5);

        // 3. Call AI service
        const { ai_response, confidence_score } = await aiService.generateResponse(
            user_message,
            business,
            recentHistory
        );

        // 4. Check if we should escalate to human
        const { shouldEscalate, fallbackMessage } = fallbackService.evaluate(
            user_message,
            ai_response,
            confidence_score,
            business
        );

        const finalResponse = shouldEscalate ? fallbackMessage : ai_response;
        const escalated = shouldEscalate;

        // 5. Save conversation
        const conversation = new Conversation({
            business_id,
            user_message,
            ai_response: finalResponse,
            confidence_score,
            escalated_to_human: escalated
        });
        await conversation.save();

        // 6. Update daily metrics
        const today = new Date().toISOString().split('T')[0];
        let metrics = await DailyMetrics.findOne({ business_id, date: today });
        if (!metrics) {
            metrics = new DailyMetrics({ business_id, date: today });
        }
        metrics.total_queries += 1;
        if (escalated) metrics.human_escalations += 1;
        if (!escalated && confidence_score >= 0.8) metrics.estimated_leads += 1;
        await metrics.save();

        res.json({
            success: true,
            response: finalResponse,
            escalated_to_human: escalated
        });
    } catch (err) {
        console.error('Chat error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error processing chat'
        });
    }
};
