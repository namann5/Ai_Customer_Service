# Frontend - How to Use

## ⚠️ IMPORTANT: Which Files to Open

**DO NOT open files from the `landing-app/` directory** - that's a React app that has conflicts.

**✅ Open these files instead:**

1. **Landing Page**: `frontend/landing.html` (not `landing-app/index.html`)
2. **Chat Page**: `frontend/chat.html`
3. **Admin Page**: `frontend/admin.html`
4. **Index Page**: `frontend/index.html` (redirects to landing.html)

## File Structure

```
frontend/
├── landing.html          ← Open this (vanilla JS)
├── chat.html             ← Open this
├── admin.html            ← Open this
├── index.html            ← Open this (redirects to landing.html)
├── css/
│   ├── style.css
│   └── additional-styles.css
├── js/
│   ├── app.js
│   ├── admin.js
│   └── landing.js
└── landing-app/          ← DO NOT USE (React app with errors)
    └── index.html        ← DO NOT OPEN THIS
```

## How to Run

### 1. Start Backend (if not already running)
```bash
cd backend
node server.js
```

### 2. Open Frontend Pages

**Option A: Direct File Access**
- Right-click on `frontend/landing.html` → Open with Browser
- Right-click on `frontend/chat.html` → Open with Browser
- Right-click on `frontend/admin.html` → Open with Browser

**Option B: Use a Local Server (Recommended)**
```bash
# In the frontend directory
npx serve .
```
Then open: `http://localhost:3000/landing.html`

## Pages Overview

### Landing Page (`landing.html`)
- Marketing page with hero section
- Features and benefits
- Demo preview
- Call-to-action buttons

### Chat Page (`chat.html`)
- Live chat interface
- Connects to backend at `http://localhost:5000/api/chat`
- Send messages to AI agent

### Admin Page (`admin.html`)
- FAQ management dashboard
- Add, view, and delete FAQs
- Connects to backend at `http://localhost:5000/api/faqs`

## Troubleshooting

### If you see React errors:
❌ You're opening the wrong file!
- Make sure you're NOT opening `frontend/landing-app/index.html`
- Open `frontend/landing.html` instead

### If styles don't load:
- Make sure you're opening the file from the `frontend/` directory
- Check that `css/style.css` and `css/additional-styles.css` exist

### If backend connection fails:
- Make sure backend is running: `cd backend && node server.js`
- Backend should be on `http://localhost:5000`
- Check console for CORS or network errors
