const faqForm = document.getElementById('faq-form');
const faqList = document.getElementById('faq-list');
const businessId = 'demo-business-id'; // Mock Business ID

// Load FAQs on start
document.addEventListener('DOMContentLoaded', fetchFAQs);

// Fetch FAQs from Backend
async function fetchFAQs() {
    try {
        const response = await fetch(`http://localhost:5000/api/faqs/${businessId}`);
        const faqs = await response.json();
        renderFAQs(faqs);
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        faqList.innerHTML = '<p class="error">Failed to load FAQs.</p>';
    }
}

// Render FAQs to DOM
function renderFAQs(faqs) {
    faqList.innerHTML = '';

    if (faqs.length === 0) {
        faqList.innerHTML = '<p class="text-muted">No FAQs added yet.</p>';
        return;
    }

    faqs.forEach(faq => {
        const item = document.createElement('div');
        item.classList.add('faq-item');
        item.innerHTML = `
            <div class="faq-content">
                <strong>Q: ${faq.question}</strong>
                <p>A: ${faq.answer}</p>
                <small class="category-tag">${faq.category}</small>
            </div>
            <button onclick="deleteFAQ('${faq._id}')" class="btn-delete">Delete</button>
        `;
        faqList.appendChild(item);
    });
}

// Add New FAQ
faqForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;
    const category = document.getElementById('category').value;

    try {
        const response = await fetch('http://localhost:5000/api/faqs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ businessId, question, answer, category })
        });

        if (response.ok) {
            faqForm.reset();
            fetchFAQs(); // Refresh list
        } else {
            alert('Failed to add FAQ');
        }
    } catch (error) {
        console.error('Error adding FAQ:', error);
    }
});

// Delete FAQ
window.deleteFAQ = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
        const response = await fetch(`http://localhost:5000/api/faqs/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchFAQs(); // Refresh list
        } else {
            alert('Failed to delete FAQ');
        }
    } catch (error) {
        console.error('Error deleting FAQ:', error);
    }
};
