const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Business = require('../models/Business');
const Conversation = require('../models/Conversation');
const DailyMetric = require('../models/DailyMetric');
const aiService = require('../services/aiService');

const FAQ = require('../models/FAQ');

// In-memory mock storage
const mockData = {
    businesses: [],
    conversations: [],
    metrics: [],
    faqs: [] // Mock FAQs
};

const isConnected = () => mongoose.connection.readyState === 1;

// @route   GET /api/faqs/:businessId
// @desc    Get all FAQs for a business
router.get('/faqs/:businessId', async (req, res) => {
    try {
        const { businessId } = req.params;
        if (isConnected()) {
            const faqs = await FAQ.find({ businessId });
            res.json(faqs);
        } else {
            const faqs = mockData.faqs.filter(f => f.businessId === businessId);
            res.json(faqs);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   POST /api/faqs
// @desc    Add a new FAQ
router.post('/faqs', async (req, res) => {
    try {
        const { businessId, question, answer, category } = req.body;

        if (isConnected()) {
            const newFAQ = new FAQ({ businessId, question, answer, category });
            const savedFAQ = await newFAQ.save();
            res.json(savedFAQ);
        } else {
            const newFAQ = {
                _id: Date.now().toString(),
                businessId, question, answer, category,
                createdAt: new Date()
            };
            mockData.faqs.push(newFAQ);
            res.json(newFAQ);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   DELETE /api/faqs/:id
// @desc    Delete an FAQ
router.delete('/faqs/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (isConnected()) {
            await FAQ.findByIdAndDelete(id);
            res.json({ success: true, message: 'FAQ deleted' });
        } else {
            mockData.faqs = mockData.faqs.filter(f => f._id !== id);
            res.json({ success: true, message: 'FAQ deleted (Mock)' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   POST /api/onboarding
// @desc    Register a new business
router.post('/onboarding', async (req, res) => {
    try {
        const { name, type, phone, hours, services, appointmentRequired, humanFallback } = req.body;

        if (isConnected()) {
            const newBusiness = new Business({ name, type, phone, hours, services, appointmentRequired, humanFallback });
            const savedBusiness = await newBusiness.save();
            return res.json({ success: true, businessId: savedBusiness._id });
        } else {
            console.log('MongoDB not connected. Using mock storage.');
            const newBusiness = {
                _id: Date.now().toString(),
                name, type, phone, hours, services, appointmentRequired, humanFallback
            };
            mockData.businesses.push(newBusiness);
            return res.json({ success: true, businessId: newBusiness._id });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   GET /api/dashboard/:businessId
// @desc    Get dashboard metrics
router.get('/dashboard/:businessId', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const businessId = req.params.businessId;

        let metrics;
        if (isConnected()) {
            metrics = await DailyMetric.findOne({ businessId, date: today });
        } else {
            metrics = mockData.metrics.find(m => m.businessId === businessId && m.date === today);
        }

        if (!metrics) {
            metrics = {
                callsHandled: 0,
                leadsGenerated: 0,
                bookingsConfirmed: 0,
                estimatedRevenue: 0
            };
        }

        res.json(metrics);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   POST /api/chat
// @desc    Handle chat message
router.post('/chat', async (req, res) => {
    try {
        const { businessId, message } = req.body;

        // 1. Get Business Context
        let business;
        if (isConnected()) {
            business = await Business.findById(businessId);
        } else {
            business = mockData.businesses.find(b => b._id === businessId);
        }

        if (!business) return res.status(404).json({ message: 'Business not found' });

        // 2. Call AI Service
        const aiResponse = await aiService.generateResponse(message, business);

        // 3. Save Conversation
        if (isConnected()) {
            const newConversation = new Conversation({ businessId, userMessage: message, aiResponse });
            await newConversation.save();
        } else {
            mockData.conversations.push({ businessId, userMessage: message, aiResponse, timestamp: new Date() });
        }

        // 4. Update Metrics
        const today = new Date().toISOString().split('T')[0];
        if (isConnected()) {
            let metric = await DailyMetric.findOne({ businessId, date: today });
            if (!metric) metric = new DailyMetric({ businessId, date: today });
            metric.callsHandled += 1;
            await metric.save();
        } else {
            let metric = mockData.metrics.find(m => m.businessId === businessId && m.date === today);
            if (!metric) {
                metric = { businessId, date: today, callsHandled: 0, leadsGenerated: 0, bookingsConfirmed: 0, estimatedRevenue: 0 };
                mockData.metrics.push(metric);
            }
            metric.callsHandled += 1;
        }

        res.json({ response: aiResponse });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
