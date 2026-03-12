/**
 * Onboarding Controller
 * Handles business registration for the platform.
 * POST /api/onboard  - Save business data, return business_id + system_prompt preview
 * GET  /api/business/:id - Fetch a business + its generated system prompt
 */
const Business = require('../models/Business');
const { buildSystemPrompt } = require('../services/aiService');

/**
 * @desc    Create a new business (onboard)
 * @route   POST /api/onboard
 */
exports.onboard = async (req, res) => {
    try {
        const {
            business_name,
            business_type,
            phone,
            working_hours,
            services,
            appointment_required = false,
            human_fallback = true,
            location = '',
            price_range = ''
        } = req.body;

        // Basic validation
        if (!business_name || !business_type || !phone || !working_hours) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: business_name, business_type, phone, working_hours'
            });
        }

        const business = new Business({
            business_name,
            business_type,
            phone,
            working_hours,
            services: Array.isArray(services)
                ? services
                : typeof services === 'string'
                    ? services.split(',').map(s => s.trim()).filter(Boolean)
                    : [],
            appointment_required: !!appointment_required,
            human_fallback: !!human_fallback,
            location,
            price_range
        });

        await business.save();

        // Auto-generate the AI system prompt from the saved data
        const system_prompt = buildSystemPrompt(business);

        res.status(201).json({
            success: true,
            business_id: business._id,
            system_prompt,
            message: 'Business onboarded successfully'
        });
    } catch (err) {
        console.error('Onboarding error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error during onboarding'
        });
    }
};

/**
 * @desc    Get a business by ID with its generated system prompt
 * @route   GET /api/business/:id
 */
exports.getBusiness = async (req, res) => {
    try {
        const business = await Business.findById(req.params.id).lean();
        if (!business) {
            return res.status(404).json({ success: false, message: 'Business not found' });
        }
        const system_prompt = buildSystemPrompt(business);
        res.json({ success: true, business, system_prompt });
    } catch (err) {
        console.error('Get business error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
