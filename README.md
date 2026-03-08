# Aki Translator

A sleek, dark-themed AI-powered translation PWA built with **Vite + React + TypeScript + Tailwind CSS + Lucide React**.

## Stack

| Tool | Purpose |
|------|---------|
| Vite 5 | Dev server & bundler |
| React 18 | UI |
| TypeScript | Type safety |
| Tailwind CSS 3 | Styling |
| Lucide React | Icons |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Environment Variables

Create a `.env` file:

```
VITE_AI_GATEWAY_API_KEY=your_api_key_here
```

## Build for production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel dashboard
3. Add environment variable: `VITE_AI_GATEWAY_API_KEY`
4. Deploy

## PWA Installation

After deploying, visit the URL on your phone:

- **iOS**: Safari → Share → "Add to Home Screen"
- **Android**: Chrome → Menu → "Install app"

## Features

- Multiple AI providers (configurable)
- Custom languages with RTL support
- History navigation (undo/redo)
- Responsive design
- Offline support
- Haptic feedback
