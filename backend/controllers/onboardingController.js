/**
 * Onboarding Controller
 * Handles business registration for the platform.
 * POST /api/onboard - Save business data
 */
const Business = require('../models/Business');

/**
 * @desc    Create a new business (onboard)
 * @route   POST /api/onboard
 * @body    { business_name, business_type, phone, working_hours, services[], appointment_required, human_fallback }
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
            human_fallback = true
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
            services: Array.isArray(services) ? services : [],
            appointment_required: !!appointment_required,
            human_fallback: !!human_fallback
        });

        await business.save();

        res.status(201).json({
            success: true,
            business_id: business._id,
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
