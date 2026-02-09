/**
 * Fallback Service
 * Decides when to escalate to a human agent.
 *
 * Triggers when:
 * - confidence_score < 0.6
 * - Question is outside business domain
 * - User explicitly asks for human
 */
const FALLBACK_MESSAGE = "I'm connecting you to a human for better assistance. Please wait a moment.";

const HUMAN_REQUEST_KEYWORDS = [
    'human', 'agent', 'person', 'talk to someone', 'manager', 'owner',
    'insaan', 'baat karao', 'kisi se baat', 'complain', 'complaint', 'issue',
    'real person', 'actual person'
];

const isExplicitHumanRequest = (message) => {
    const lower = (message || '').toLowerCase();
    return HUMAN_REQUEST_KEYWORDS.some((kw) => lower.includes(kw));
};

const DOMAIN_OUTSIDE_PATTERNS = [
    /political/i, /election/i, /cricket/i, /movie/i, /weather/i,
    /stock/i, /crypto/i, /bitcoin/i, /recipe/i, /joke/i
];

const isOutsideDomain = (message) => {
    return DOMAIN_OUTSIDE_PATTERNS.some((p) => p.test(message || ''));
};

/**
 * Evaluate whether to escalate to human
 * @returns { shouldEscalate, fallbackMessage }
 */
const evaluate = (userMessage, aiResponse, confidenceScore, business) => {
    if (!business?.human_fallback) {
        return { shouldEscalate: false, fallbackMessage: FALLBACK_MESSAGE };
    }

    if (isExplicitHumanRequest(userMessage)) {
        return { shouldEscalate: true, fallbackMessage: FALLBACK_MESSAGE };
    }

    if (typeof confidenceScore === 'number' && confidenceScore < 0.6) {
        return { shouldEscalate: true, fallbackMessage: FALLBACK_MESSAGE };
    }

    if (isOutsideDomain(userMessage)) {
        return { shouldEscalate: true, fallbackMessage: FALLBACK_MESSAGE };
    }

    return { shouldEscalate: false, fallbackMessage: FALLBACK_MESSAGE };
};

module.exports = { evaluate, isExplicitHumanRequest };
