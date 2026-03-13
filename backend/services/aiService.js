/**
 * AI Service
 * Calls LLM (Claude / Gemini / OpenAI) via API.
 * Builds dynamic system prompt from business context + live FAQ data.
 * Returns { ai_response, confidence_score }.
 *
 * Set in .env:
 * - LLM_PROVIDER: claude | gemini | openai
 * - ANTHROPIC_API_KEY (for Claude)
 * - GOOGLE_AI_API_KEY (for Gemini)
 * - OPENAI_API_KEY (for OpenAI)
 */

/**
 * Build the dynamic system prompt using business context and FAQ list.
 * Follows the WhatsApp assistant template with full multi-language support.
 *
 * @param {Object} business - Business document from DB
 * @param {Array}  faqs     - Array of FAQ objects { question, answer, category }
 */
const buildSystemPrompt = (business, faqs = []) => {
    const cityOrLocation = business.location || 'India';

    // Format FAQ list for injection
    let faqBlock = '';
    if (faqs.length > 0) {
        faqBlock = faqs
            .map((f, i) => `Q${i + 1}: ${f.question}\nA${i + 1}: ${f.answer}`)
            .join('\n\n');
    } else {
        // Fall back to service/hours info from business doc
        const servicesList = Array.isArray(business.services) && business.services.length
            ? business.services.join(', ')
            : 'General inquiries';
        faqBlock =
            `Q1: What services do you offer?\nA1: ${servicesList}\n\n` +
            `Q2: What are your working hours?\nA2: ${business.working_hours || 'Please contact us for timings.'}\n\n` +
            `Q3: Do I need an appointment?\nA3: ${business.appointment_required ? 'Yes, please book an appointment in advance.' : 'No appointment needed, walk-ins welcome.'}`;
    }

    return `You are a helpful customer service assistant for "${business.business_name}", \
a ${business.business_type} located in ${cityOrLocation}, India.

LANGUAGE RULES:
- Detect the language of the customer's message automatically
- Always reply in the SAME language the customer used
- Support: Hindi, Hinglish, English, Tamil, Telugu, Bengali, Marathi
- For Hinglish, respond naturally in Hinglish (mix of Hindi + English)
- Keep tone warm, friendly, and respectful — like a helpful shop assistant

BUSINESS CONTEXT (use ONLY this info — never guess):
${faqBlock}

YOUR BEHAVIOR:
- Answer only questions related to this business
- If you don't know something, say: "Main abhi sure nahi hoon, ek minute mein hum aapko connect karte hain" and indicate escalation is needed
- Never make up prices, timings, or availability — only use the FAQ data above
- Keep responses SHORT (2-3 lines max) — this is WhatsApp, not email
- If customer seems angry or frustrated, immediately offer human handoff

ESCALATE TO HUMAN when:
- Customer asks something not in the FAQ above
- Customer says "human", "agent", "staff", "insaan se baat"
- Complaint, refund, or return request
- Medical, legal, or other sensitive queries`;
};

const buildUserPrompt = (userMessage, recentHistory = []) => {
    let prompt = 'Recent conversation (if any):\n';
    if (recentHistory.length) {
        recentHistory.forEach((c) => {
            prompt += `Customer: ${c.user_message}\n`;
            prompt += `You: ${c.ai_response}\n`;
        });
    } else {
        prompt += '(None)\n';
    }
    prompt += `\nCurrent customer message: ${userMessage}`;
    return prompt;
};

/**
 * Call LLM API and extract response + confidence.
 * Supports Claude, Gemini, OpenAI.
 */
const callLLM = async (systemPrompt, userPrompt) => {
    const provider = (process.env.LLM_PROVIDER || 'claude').toLowerCase();

    if (provider === 'claude') return callClaude(systemPrompt, userPrompt);
    if (provider === 'openai') return callOpenAI(systemPrompt, userPrompt);
    if (provider === 'gemini') return callGemini(systemPrompt, userPrompt);

    // Fallback: no API key — use rule-based demo
    return fallbackDemoResponse(userPrompt);
};

const callClaude = async (systemPrompt, userPrompt) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        console.warn('ANTHROPIC_API_KEY not set. Using demo mode.');
        return fallbackDemoResponse(userPrompt);
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
            max_tokens: 150,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }]
        })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Claude API error: ${res.status} ${err}`);
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || '';
    const score = extractConfidence(text) ?? 0.85;
    return { ai_response: text.trim(), confidence_score: score };
};

const callOpenAI = async (systemPrompt, userPrompt) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.warn('OPENAI_API_KEY not set. Using demo mode.');
        return fallbackDemoResponse(userPrompt);
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            max_tokens: 150,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`OpenAI API error: ${res.status} ${err}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    const score = extractConfidence(text) ?? 0.85;
    return { ai_response: text.trim(), confidence_score: score };
};

const callGemini = async (systemPrompt, userPrompt) => {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        console.warn('GOOGLE_AI_API_KEY not set. Using demo mode.');
        return fallbackDemoResponse(userPrompt);
    }

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
                generationConfig: {
                    maxOutputTokens: 150,
                    temperature: 0.3
                }
            })
        }
    );

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Gemini API error: ${res.status} ${err}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const score = extractConfidence(text) ?? 0.85;
    return { ai_response: text.trim(), confidence_score: score };
};

/**
 * Demo mode when no API key is set — keyword-based Hinglish responses.
 * Handles a broader set of Hindi, Hinglish, and regional language keywords.
 */
const fallbackDemoResponse = (userPrompt) => {
    const msg = userPrompt.split('Current customer message:')[1]?.trim() || userPrompt;
    const lower = msg.toLowerCase();

    // Timings / hours
    if (lower.match(/open|kab|time|timings|hours|baje|ghante|samay|waqt/)) {
        return {
            ai_response: 'Haan ji! Hum 10 AM se 8 PM tak open rehte hain. Koi aur sawaal hai? 😊',
            confidence_score: 0.9
        };
    }

    // Appointment / booking
    if (lower.match(/appointment|book|booking|schedule|slot|kab aayein|milna/)) {
        return {
            ai_response: 'Ji bilkul! Appointment ke liye kaun si date aur time theek rehega aapke liye?',
            confidence_score: 0.88
        };
    }

    // Price / cost
    if (lower.match(/price|kitna|cost|fees|charge|rate|paisa|rupee|kitne ka/)) {
        return {
            ai_response: 'Price service ke hisaab se alag-alag hoti hai. Kya main aapko ek agent se connect karwaun jo sahi details de sake?',
            confidence_score: 0.55
        };
    }

    // Complaint / refund / return — escalate
    if (lower.match(/complaint|complain|shikayat|refund|wapas|return|problem|issue|dikkat|trouble/)) {
        return {
            ai_response: 'Main abhi sure nahi hoon, ek minute mein hum aapko connect karte hain. 🙏',
            confidence_score: 0.3
        };
    }

    // Location / address
    if (lower.match(/address|location|kahan|kahaan|where|gali|street|city/)) {
        return {
            ai_response: 'Humara address aapko WhatsApp pe share kar dete hain. Ek second! 📍',
            confidence_score: 0.75
        };
    }

    // Services
    if (lower.match(/service|kya karte|kya milega|offer|available|kya hai/)) {
        return {
            ai_response: 'Hum kai tarah ki services provide karte hain. Koi specific cheez batayein, main madad karunga! 😊',
            confidence_score: 0.8
        };
    }

    // Generic fallback
    return {
        ai_response: 'Samajh gaya ji. Thoda aur detail de sakte hain? Ya main aapko human agent se connect karwaun?',
        confidence_score: 0.5
    };
};

/**
 * Try to extract [CONFIDENCE: 0.8] from response if LLM includes it
 */
const extractConfidence = (text) => {
    const match = text.match(/\[CONFIDENCE:\s*([\d.]+)\]/i);
    return match ? parseFloat(match[1]) : null;
};

/**
 * Main entry: generate AI response
 *
 * @param {string} userMessage    - The customer's message
 * @param {Object} business       - Business document from DB
 * @param {Array}  recentHistory  - Last N conversation turns
 * @param {Array}  faqs           - FAQ documents for this business
 */
const generateResponse = async (userMessage, business, recentHistory = [], faqs = []) => {
    const systemPrompt = buildSystemPrompt(business, faqs);
    const userPrompt = buildUserPrompt(userMessage, recentHistory);
    return callLLM(systemPrompt, userPrompt);
};

module.exports = { generateResponse, buildSystemPrompt };
