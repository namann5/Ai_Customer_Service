# AI Customer Service — Landing (Step 1)

Condensed prototype for early validation. Four sections: Hero, Problem, Demo, Final CTA.

## Structure

```
/landing
├── index.html
├── css/styles.css
├── js/main.js
├── assets/
│   ├── icons/
│   ├── images/
│   └── fonts/
└── README.md
```

## Sections

1. **Hero** — Emotional headline, subtext, primary CTA, typing-style Hinglish demo
2. **Problem** — "Sound familiar?" + 3 story-based cards (morning / afternoon / evening)
3. **Demo** — WhatsApp-style UI with one realistic exchange
4. **Final CTA** — "Stop missing customers. Start today." + single CTA button

## Design

- Emerald/peacock palette (#0D5C4B, #0B6E5C)
- Warm off-white backgrounds (#F8F6F3)
- Playfair Display (headings) + DM Sans (body)
- Soft shadows, generous spacing, no flat UI

## Run

Open `index.html` in a browser, or serve the folder with any static server:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Then visit `http://localhost:8080`.

## Deploy

Upload the `landing` folder to Netlify, Vercel, or any static host. Point the root to `index.html`.

## Next Steps

- Refine visual depth
- Connect demo to backend MVP
- Prepare for early onboarding
