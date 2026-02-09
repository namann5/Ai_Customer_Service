const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');

// Unique ID for session (mock)
const businessId = 'demo-business-id';

// Auto-scroll to bottom
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    div.textContent = text;
    chatMessages.appendChild(div);
    scrollToBottom();
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    userInput.value = '';

    // Show typing indicator (optional, maybe later)

    try {
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                businessId: businessId,
                message: message
            })
        });

        const data = await response.json();

        // Add AI response
        if (data.response) {
            addMessage(data.response, 'ai');
        } else {
            addMessage("Sorry, I'm having trouble connecting.", 'ai');
        }

    } catch (error) {
        console.error('Error:', error);
        addMessage("Server error. Please ensure backend is running.", 'ai');
    }
});
