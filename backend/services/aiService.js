const fallbackService = require('./fallbackService');

// Mock AI response function for MVP to work without immediate API key
// In production, this would use OpenAI or Google Gemini SDK
const generateResponse = async (userMessage, businessContext) => {

    // 1. Check for specific keywords to trigger hard-coded logic or fallback
    if (fallbackService.shouldFallback(userMessage)) {
        return "I am a bit stuck. Let me connect you to a human agent. Please wait...";
    }

    // 2. Construct System Prompt
    const systemPrompt = `
    You are an AI assistant for ${businessContext.name}, a ${businessContext.type}.
    Your goal is to help customers politely and efficiently.
    Speak in "Hinglish" (Indian English mix) if the user does.
    
    Business Info:
    - Hours: ${businessContext.hours}
    - Phone: ${businessContext.phone}
    - Services: ${businessContext.services}
    - Appointment Required: ${businessContext.appointmentRequired ? 'Yes' : 'No'}
    
    Rules:
    - Be polite (Use "Ji", "Sir/Ma'am").
    - Keep answers short (under 50 words).
    - If asking for appointment, confirm date/time.
    - If unsure, say you don't know and offer to connect to human.
    `;

    // 3. Simulate AI delay and response (Replace with real API call)
    // const completion = await openai.chat.completions.create({...})

    console.log("System Prompt:", systemPrompt);
    console.log("User Message:", userMessage);

    // Simple keyword matching for demo purposes
    const lowerMsg = userMessage.toLowerCase();

    if (lowerMsg.includes('open') || lowerMsg.includes('time') || lowerMsg.includes('kab')) {
        return `Hum ${businessContext.hours} open rehte hain Ji.`;
    }

    if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('kitna')) {
        return "Prices service ke hisaab se hote hain. Kya main aapko call karwaun?";
    }

    if (lowerMsg.includes('appointment') || lowerMsg.includes('book')) {
        if (businessContext.appointmentRequired) {
            return "Ji bilkul. Kis time ka appointment chahiye aapko?";
        } else {
            return "Appointment ki zaroorat nahi hai sir, aap kabhi bhi aa sakte hain!";
        }
    }

    // Default response
    return "Main samajh gaya. Kya aap aur detail de sakte hain? Ya main shop owner se call karwaun?";
};

module.exports = { generateResponse };
