const API_BASE = 'http://localhost:5000';

const statusEl = document.getElementById('status');
const outputEl = document.getElementById('output');
const customersEl = document.getElementById('customers');

function setStatus(text, type) {
    if (statusEl) {
        statusEl.textContent = text;
        statusEl.className = 'status ' + (type || '');
    }
}

function setOutput(text) {
    if (outputEl) outputEl.innerText = text || '';
}

function setCustomers(html) {
    if (customersEl) customersEl.innerHTML = html || '';
}

fetch(API_BASE + '/api/demo')
    .then(res => {
        if (!res.ok) throw new Error('Backend returned ' + res.status);
        return res.json();
    })
    .then(data => {
        setStatus('Backend Connected', 'connected');
        setOutput(data?.message ?? JSON.stringify(data));
        loadCustomers();
    })
    .catch(err => {
        console.error(err);
        setStatus('Error: ' + err.message + '. Is the backend running on port 5000?', 'error');
        setOutput('');
    });

async function loadCustomers() {
    try {
        const res = await fetch(API_BASE + '/api/customers');
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Request failed');

        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            setCustomers('<h2>Sample Customers</h2>' + data.data.map(c =>
                `<div class="customer-item">${c.name || ''} — ${c.phone || ''} (${c.businessType || ''})</div>`
            ).join(''));
        } else {
            setCustomers('<h2>Customers</h2><p>No customers in database.</p>');
        }
    } catch (err) {
        setCustomers('<p style="color:#991b1b">Could not load customers: ' + (err.message || 'Unknown error') + '</p>');
    }
}
