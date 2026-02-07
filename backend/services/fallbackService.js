const shouldFallback = (message) => {
    const fallbackKeywords = [
        'human', 'agent', 'person', 'talk to someone',
        'insaan', 'baat karao', 'manager', 'complain', 'issue'
    ];

    const lowerMsg = message.toLowerCase();

    return fallbackKeywords.some(keyword => lowerMsg.includes(keyword));
};

module.exports = { shouldFallback };
