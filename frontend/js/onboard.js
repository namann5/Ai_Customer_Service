/**
 * onboard.js — 6-Step Business Onboarding Wizard
 * Handles step navigation, validation, API submission, and success screen.
 */

const API_BASE = 'http://localhost:5000/api';

const TOTAL_STEPS = 6;
let currentStep = 1;
let appointmentRequired = false;

// ── DOM refs ──────────────────────────────────────────────
const progressFill  = document.getElementById('progress-fill');
const progressLabel = document.getElementById('progress-label');
const stepsContainer = document.getElementById('steps-container');
const submitBtn     = document.getElementById('submit-btn');
const successScreen = document.getElementById('success-screen');
const formCard      = document.getElementById('form-card');

// ── Progress ──────────────────────────────────────────────
function updateProgress() {
  const pct = ((currentStep - 1) / TOTAL_STEPS) * 100;
  progressFill.style.width = pct + '%';
  progressLabel.textContent = `Step ${currentStep} of ${TOTAL_STEPS}`;
}

// ── Step navigation ───────────────────────────────────────
function showStep(n, direction = 1) {
  const current = document.querySelector('.ob-step.active');
  const next    = document.getElementById(`step-${n}`);
  if (!next) return;

  if (current) {
    current.classList.add(direction > 0 ? 'exit-left' : 'exit-right');
    current.addEventListener('transitionend', () => {
      current.classList.remove('active', 'exit-left', 'exit-right');
      current.style.display = 'none';
    }, { once: true });
  }

  next.style.display = 'block';
  requestAnimationFrame(() => {
    next.style.transform = direction > 0 ? 'translateX(40px)' : 'translateX(-40px)';
    next.style.opacity = '0';
    requestAnimationFrame(() => {
      next.classList.add('active');
      next.style.transform = '';
      next.style.opacity = '';
    });
  });

  currentStep = n;
  updateProgress();
  updateNavButtons();
}

function updateNavButtons() {
  const backBtn = document.getElementById('back-btn');
  backBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
  if (currentStep === TOTAL_STEPS) {
    submitBtn.style.display = 'inline-flex';
    document.getElementById('next-btn').style.display = 'none';
  } else {
    submitBtn.style.display = 'none';
    document.getElementById('next-btn').style.display = 'inline-flex';
  }
}

// ── Business-type chips ───────────────────────────────────
let selectedType = '';
document.querySelectorAll('.ob-chip[data-type]').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.ob-chip[data-type]').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    selectedType = chip.dataset.type;
    clearError('step-2-field');
  });
});

// ── Appointment toggle ────────────────────────────────────
document.querySelectorAll('.ob-toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ob-toggle-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    appointmentRequired = btn.dataset.value === 'true';
  });
});

// ── Validation ────────────────────────────────────────────
function showError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.classList.add('has-error');
  const err = field.querySelector('.ob-error');
  if (err) err.textContent = msg;
}
function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) field.classList.remove('has-error');
}

function validateStep(n) {
  switch (n) {
    case 1: {
      const name = document.getElementById('business_name').value.trim();
      if (!name) { showError('step-1-field', 'Please enter your business name'); return false; }
      clearError('step-1-field');
      return true;
    }
    case 2: {
      if (!selectedType) { showError('step-2-field', 'Please select a business type'); return false; }
      clearError('step-2-field');
      return true;
    }
    case 3: {
      const phone = document.getElementById('phone').value.trim();
      if (!phone) { showError('step-3-field', 'Please enter your WhatsApp number'); return false; }
      if (!/^[+]?[\d\s\-()]{7,15}$/.test(phone)) { showError('step-3-field', 'Please enter a valid phone number'); return false; }
      clearError('step-3-field');
      return true;
    }
    case 4: {
      const hours = document.getElementById('working_hours').value.trim();
      if (!hours) { showError('step-4-field', 'Please enter your working hours'); return false; }
      clearError('step-4-field');
      return true;
    }
    case 5: {
      const services = document.getElementById('services').value.trim();
      if (!services) { showError('step-5-field', 'Please list at least one service'); return false; }
      clearError('step-5-field');
      return true;
    }
    case 6: return true; // toggle always has a default
    default: return true;
  }
}

// ── Next / Back buttons ───────────────────────────────────
document.getElementById('next-btn').addEventListener('click', () => {
  if (validateStep(currentStep)) {
    if (currentStep === 5) buildPreview();
    showStep(currentStep + 1, 1);
  }
});
document.getElementById('back-btn').addEventListener('click', () => {
  showStep(currentStep - 1, -1);
});

// ── Build prompt preview (Step 6) ─────────────────────────
function buildPreview() {
  const name     = document.getElementById('business_name').value.trim();
  const hours    = document.getElementById('working_hours').value.trim();
  const services = document.getElementById('services').value.trim();
  const preview  = `You are a polite AI assistant for "${name}", a ${selectedType} in India.

BUSINESS CONTEXT:
- Name: ${name}
- Type: ${selectedType}
- Working Hours: ${hours}
- Services: ${services}
- Appointment Required: ${appointmentRequired ? 'Yes' : 'No'}

STRICT RULES:
1. Use polite Indian tone: "ji", "please", "thank you"
2. Keep replies SHORT (under 50 words)
3. If info is NOT in the context above → connect to human
4. Use Hinglish if customer writes in Hinglish`;
  document.getElementById('prompt-preview').textContent = preview;
}

// ── Submit ────────────────────────────────────────────────
submitBtn.addEventListener('click', async () => {
  const btnEl  = submitBtn;
  const btnInner = btnEl.closest('.ob-btn-wrap') || btnEl.parentElement;

  // Disable + spinner
  btnEl.disabled = true;
  btnEl.classList.add('loading');

  const payload = {
    business_name:        document.getElementById('business_name').value.trim(),
    business_type:        selectedType,
    phone:                document.getElementById('phone').value.trim(),
    working_hours:        document.getElementById('working_hours').value.trim(),
    services:             document.getElementById('services').value.trim(),
    appointment_required: appointmentRequired,
    human_fallback:       true
  };

  try {
    const res  = await fetch(`${API_BASE}/onboard`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Submission failed');
    }

    showSuccessScreen(data.business_id, data.system_prompt);

  } catch (err) {
    console.error('Onboard error:', err);
    alert('Something went wrong: ' + err.message + '\n\nMake sure the backend is running on http://localhost:5000');
    btnEl.disabled = false;
    btnEl.classList.remove('loading');
  }
});

// ── Success screen ────────────────────────────────────────
function showSuccessScreen(businessId, systemPrompt) {
  formCard.style.display = 'none';
  successScreen.classList.add('active');
  successScreen.style.display = 'block';

  document.getElementById('success-business-id').textContent = businessId;
  if (systemPrompt) {
    document.getElementById('success-prompt').textContent = systemPrompt;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Init ──────────────────────────────────────────────────
updateProgress();
updateNavButtons();
