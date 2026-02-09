/**
 * AI Customer Service - Landing (Step 1)
 * Typing demo + light interactions
 */
(function () {
    'use strict';

    // Typing-style demo in hero
    const customerMessage = 'Clinic open hai?';
    const aiResponse = 'Haan ji 😊 Clinic 10 AM se 8 PM tak open hai.';
    const typingSpeed = 80;
    const pauseBeforeReply = 600;

    const lineEl = document.getElementById('typing-line');
    const cursorEl = document.getElementById('typing-cursor');
    const replyEl = document.getElementById('typing-reply');

    function typeCustomerMessage() {
        if (!lineEl || !cursorEl || !replyEl) return;

        lineEl.textContent = '';
        replyEl.innerHTML = '';
        cursorEl.style.opacity = '1';

        let i = 0;
        const interval = setInterval(function () {
            if (i < customerMessage.length) {
                lineEl.textContent += customerMessage[i];
                i++;
            } else {
                clearInterval(interval);
                cursorEl.style.opacity = '0';
                setTimeout(function () {
                    replyEl.innerHTML = '<p>' + aiResponse + '</p>';
                }, pauseBeforeReply);
            }
        }, typingSpeed);
    }

    // Start typing when page loads (short delay)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(typeCustomerMessage, 800);
        });
    } else {
        setTimeout(typeCustomerMessage, 800);
    }

    // Smooth scroll for CTA (optional enhancement)
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();
