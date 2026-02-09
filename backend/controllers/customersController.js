/**
 * Customers Controller
 * Handles fetching customer/business data
 */

const Business = require('../models/Business');

// Get all customers/businesses
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Business.find().sort({ createdAt: -1 }).limit(10);
        res.json({
            success: true,
            data: customers
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customers',
            data: []
        });
    }
};
