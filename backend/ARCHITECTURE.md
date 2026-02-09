# AI Customer Service – Backend Architecture

## Overview

Monolithic Node.js backend for an AI + Human Hybrid Customer Service product targeting Indian MSMEs (clinics, salons, kirana stores, coaching centers). Designed for Startup India demos, government funding pitches, and early pilot customers.

**Principles:** Simple, clear, scalable. No over-engineering.

---

## Tech Stack

| Layer      | Technology        |
|-----------|-------------------|
| Runtime   | Node.js           |
| Framework | Express.js        |
| Database  | MongoDB (Atlas)   |
| LLM       | Claude / Gemini / OpenAI (via API) |
| Secrets   | dotenv            |

**Not used:** Microservices, GraphQL, Kubernetes, Redis.

---

## Folder Structure

```
backend/
├── server.js              # Entry point, middleware, route mounting
├── package.json
├── .env                   # Secrets (never commit)
├── .env.example           # Template for required vars
├── config/
│   └── db.js              # MongoDB connection
├── routes/
│   └── apiRoutes.js       # REST API routes
├── controllers/
│   ├── onboardingController.js
│   ├── chatController.js
│   └── metricsController.js
├── services/
│   ├── aiService.js       # LLM calls, prompt building
│   ├── memoryService.js   # Recent conversation context
│   └── fallbackService.js # Human escalation logic
└── models/
    ├── Business.js
    ├── Conversation.js
    └── DailyMetrics.js
```

---

## API Endpoints

| Method | Endpoint              | Description                          |
|--------|------------------------|--------------------------------------|
| POST   | /api/onboard           | Register a business                  |
| POST   | /api/chat              | Process customer message             |
| GET    | /api/metrics/:business_id | Get daily metrics (optional ?date=YYYY-MM-DD) |

---

## Database Schemas

### Business
- `business_name`, `business_type`, `phone`, `working_hours`
- `services` (array)
- `appointment_required`, `human_fallback`
- `created_at`

### Conversation
- `business_id`, `user_message`, `ai_response`
- `confidence_score`, `escalated_to_human`
- `timestamp`

### DailyMetrics
- `business_id`, `date` (YYYY-MM-DD)
- `total_queries`, `human_escalations`, `estimated_leads`

---

## AI Flow

1. **Prompt building** – `aiService` constructs a system prompt from business context.
2. **LLM call** – Claude / Gemini / OpenAI returns a response and (if provided) confidence.
3. **Fallback check** – `fallbackService` evaluates:
   - confidence &lt; 0.6
   - explicit request for human
   - question outside business domain
4. **Response** – Either AI reply or: *"I'm connecting you to a human for better assistance."*

---

## Example API Usage

### Onboard
```json
POST /api/onboard
{
  "business_name": "Dr. Sharma Clinic",
  "business_type": "clinic",
  "phone": "+919876543210",
  "working_hours": "10 AM - 8 PM",
  "services": ["Consultation", "Blood test", "ECG"],
  "appointment_required": true,
  "human_fallback": true
}
```

### Chat
```json
POST /api/chat
{
  "business_id": "<mongo_id>",
  "user_message": "Clinic open hai?"
}
```

### Metrics
```
GET /api/metrics/<business_id>?date=2026-02-09
```

---

## Security

- All secrets in `.env`; never exposed to frontend.
- Basic rate limiting: 100 requests/minute/IP.
- CORS enabled for frontend origin.
- No ML training or fine-tuning; LLM used only via API.

---

## Running

```bash
cd backend
cp .env.example .env   # Edit with real keys
npm install
npm start
```
