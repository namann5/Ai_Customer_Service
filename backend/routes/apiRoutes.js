/**
 * API Routes
 * REST endpoints for the AI Customer Service platform.
 *
 * GET  /api/demo     - Test backend connection
 * GET  /api/customers - Get all customers
 * POST /api/onboard  - Save business data
 * POST /api/chat     - Process chat message
 * GET  /api/metrics/:business_id - Daily stats
 * GET  /api/faqs/:businessId - Get all FAQs for a business
 * POST /api/faqs     - Add new FAQ
 * DELETE /api/faqs/:id - Delete FAQ
 */
const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboardingController');
const chatController = require('../controllers/chatController');
const metricsController = require('../controllers/metricsController');
const demoController = require('../controllers/demoController');
const customersController = require('../controllers/customersController');
const faqController = require('../controllers/faqController');

// Demo & Testing
router.get('/demo', demoController.demo);

// Customers
router.get('/customers', customersController.getCustomers);

// Onboarding
router.post('/onboard', onboardingController.onboard);

// Chat
router.post('/chat', chatController.chat);

// Metrics
router.get('/metrics/:business_id', metricsController.getMetrics);

// FAQs
router.get('/faqs/:businessId', faqController.getFAQs);
router.post('/faqs', faqController.addFAQ);
router.delete('/faqs/:id', faqController.deleteFAQ);

module.exports = router;

