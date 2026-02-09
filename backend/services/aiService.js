/**
 * AI Service
 * Calls LLM (Claude / Gemini / OpenAI) via API.
 * Builds dynamic system prompt from business context.
 * Returns { ai_response, confidence_score }.
 *
 * Set in .env:
 * - LLM_PROVIDER: claude | gemini | openai
 * - ANTHROPIC_API_KEY (for Claude)
 * - GOOGLE_AI_API_KEY (for Gemini)
 * - OPENAI_API_KEY (for OpenAI)
 */
const buildSystemPrompt = (business) => {
    const servicesList = Array.isArray(business.services) && business.services.length
        ? business.services.join(', ')
        : 'General inquiries';

    return `You are a polite AI assistant for "${business.business_name}", a ${business.business_type} in India.

BUSINESS CONTEXT (use ONLY this info — never guess):
- Name: ${business.business_name}
- Type: ${business.business_type}
- Phone: ${business.phone}
- Working Hours: ${business.working_hours}
- Services: ${servicesList}
- Appointment Required: ${business.appointment_required ? 'Yes' : 'No'}

STRICT RULES:
1. Use polite Indian tone: "ji", "please", "thank you", "sir/ma'am"
2. Keep replies SHORT (under 50 words)
3. If info is NOT in the context above, say: "I don't have that info. Let me connect you to a human."
4. Use Hinglish if the customer writes in Hinglish
5. For timings → use working_hours exactly
6. For appointments → if appointment_required is true, ask for date/time
7. NEVER make up prices, addresses, or details not provided
8. If unsure, offer to connect to human`;

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

    if (provider === 'claude') {
        return callClaude(systemPrompt, userPrompt);
    }
    if (provider === 'openai') {
        return callOpenAI(systemPrompt, userPrompt);
    }
    if (provider === 'gemini') {
        return callGemini(systemPrompt, userPrompt);
    }

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
 * Demo mode when no API key is set — keyword-based responses
 */
const fallbackDemoResponse = (userPrompt) => {
    const msg = userPrompt.split('Current customer message:')[1]?.trim() || userPrompt;
    const lower = msg.toLowerCase();

    if (lower.includes('open') || lower.includes('kab') || lower.includes('time') || lower.includes('hai')) {
        return {
            ai_response: 'Haan ji, clinic 10 AM se 8 PM tak open hai. Aap kabhi bhi aa sakte hain!',
            confidence_score: 0.9
        };
    }
    if (lower.includes('price') || lower.includes('kitna') || lower.includes('cost')) {
        return {
            ai_response: 'Price service ke hisaab se hota hai. Kya main aapko human agent se connect karwaun for details?',
            confidence_score: 0.5
        };
    }
    if (lower.includes('appointment') || lower.includes('book')) {
        return {
            ai_response: 'Ji bilkul. Kis date aur time ka appointment chahiye aapko?',
            confidence_score: 0.85
        };
    }

    return {
        ai_response: 'Main samajh gaya. Thoda aur detail de sakte hain? Ya main aapko human agent se connect karwaun?',
        confidence_score: 0.6
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
 */
const generateResponse = async (userMessage, business, recentHistory = []) => {
    const systemPrompt = buildSystemPrompt(business);
    const userPrompt = buildUserPrompt(userMessage, recentHistory);
    return callLLM(systemPrompt, userPrompt);
};

module.exports = { generateResponse, buildSystemPrompt };
