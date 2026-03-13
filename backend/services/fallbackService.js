/**
 * Fallback Service
 * Decides when to escalate to a human agent.
 *
 * Triggers when:
 * - confidence_score < 0.6
 * - Question is outside business domain
 * - User explicitly asks for human
 * - Complaint / refund / sensitive query detected
 */

// Hindi escalation message matching the WhatsApp assistant spec
const FALLBACK_MESSAGE =
    'Main abhi sure nahi hoon, ek minute mein hum aapko connect karte hain. 🙏';

// Keywords that mean the customer wants a human — includes Hindi/Hinglish/regional variants
const HUMAN_REQUEST_KEYWORDS = [
    // English
    'human', 'agent', 'person', 'talk to someone', 'manager', 'owner',
    'real person', 'actual person', 'staff',
    // Hindi / Hinglish
    'insaan', 'insaan se baat', 'baat karao', 'kisi se baat', 'aadmi se baat',
    'manager ko bulaao', 'owner se baat',
    // Complaints / refund — also triggers escalation
    'complain', 'complaint', 'complaint karna', 'shikayat',
    'refund', 'wapas karo', 'wapas chahiye', 'return',
];

/**
 * Check if the customer is explicitly asking for a human or escalation
 */
const isExplicitHumanRequest = (message) => {
    const lower = (message || '').toLowerCase();
    return HUMAN_REQUEST_KEYWORDS.some((kw) => lower.includes(kw));
};

/**
 * Check for off-topic / outside-domain messages
 */
const DOMAIN_OUTSIDE_PATTERNS = [
    /political/i, /election/i, /cricket/i, /movie/i, /weather/i,
    /stock/i, /crypto/i, /bitcoin/i, /recipe/i, /joke/i
];

const isOutsideDomain = (message) => {
    return DOMAIN_OUTSIDE_PATTERNS.some((p) => p.test(message || ''));
};

/**
 * Check for sensitive queries — medical / legal / financial
 * These should always be escalated to a human.
 */
const SENSITIVE_PATTERNS = [
    /medicine|medical|diagnosis|prescription|doctor se|legal|lawyer|court|insurance|lawsuit/i
];

const isSensitiveQuery = (message) => {
    return SENSITIVE_PATTERNS.some((p) => p.test(message || ''));
};

/**
 * Evaluate whether to escalate to human
 * @returns {{ shouldEscalate: boolean, fallbackMessage: string }}
 */
const evaluate = (userMessage, aiResponse, confidenceScore, business) => {
    if (!business?.human_fallback) {
        return { shouldEscalate: false, fallbackMessage: FALLBACK_MESSAGE };
    }

    if (isExplicitHumanRequest(userMessage)) {
        return { shouldEscalate: true, fallbackMessage: FALLBACK_MESSAGE };
    }

    if (isSensitiveQuery(userMessage)) {
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

module.exports = { evaluate, isExplicitHumanRequest, isSensitiveQuery };
