/**
 * Metrics Controller
 * Returns daily stats for dashboards and demos.
 * GET /api/metrics/:business_id - Simple daily stats
 */
const DailyMetrics = require('../models/DailyMetrics');
const Conversation = require('../models/Conversation');

/**
 * @desc    Get daily metrics for a business
 * @route   GET /api/metrics/:business_id
 * @query   date (optional) - YYYY-MM-DD, defaults to today
 */
exports.getMetrics = async (req, res) => {
    try {
        const { business_id } = req.params;
        const date = req.query.date || new Date().toISOString().split('T')[0];

        const metrics = await DailyMetrics.findOne({
            business_id,
            date
        });

        if (!metrics) {
            return res.json({
                date,
                total_queries: 0,
                human_escalations: 0,
                estimated_leads: 0
            });
        }

        res.json({
            date: metrics.date,
            total_queries: metrics.total_queries,
            human_escalations: metrics.human_escalations,
            estimated_leads: metrics.estimated_leads
        });
    } catch (err) {
        console.error('Metrics error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error fetching metrics'
        });
    }
};
