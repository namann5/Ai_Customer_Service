/**
 * FAQ Controller
 * Handles CRUD operations for FAQs
 */

const FAQ = require('../models/FAQ');

// Get all FAQs for a business
exports.getFAQs = async (req, res) => {
    try {
        const { businessId } = req.params;
        const faqs = await FAQ.find({ businessId }).sort({ createdAt: -1 });
        res.json(faqs);
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
};

// Add new FAQ
exports.addFAQ = async (req, res) => {
    try {
        const { businessId, question, answer, category } = req.body;

        if (!businessId || !question || !answer) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const faq = new FAQ({
            businessId,
            question,
            answer,
            category: category || 'General'
        });

        await faq.save();
        res.status(201).json(faq);
    } catch (error) {
        console.error('Error adding FAQ:', error);
        res.status(500).json({ error: 'Failed to add FAQ' });
    }
};

// Delete FAQ
exports.deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        await FAQ.findByIdAndDelete(id);
        res.json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        res.status(500).json({ error: 'Failed to delete FAQ' });
    }
};
