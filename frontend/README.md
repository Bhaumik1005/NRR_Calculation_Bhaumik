# 🏏 Frontend Web App

React application for IPL NRR calculations with a clean, simple interface.

## Quick Start

**Make sure backend is running first!**

```bash
npm install
npm run dev
```

App runs on `http://localhost:5173`

## What It Does

- Shows current IPL points table
- Simple form to enter match details
- Instant NRR calculation results
- Works on mobile and desktop

## How to Use

1. **Select teams** from dropdown menus
2. **Enter match details** - overs, runs, desired position  
3. **Choose batting/bowling first**
4. **Click calculate** - get instant results

## Example Results

**Input:** RR scores 150 vs RCB, wants position 2  
**Output:** "Restrict RCB between 60-130 runs"

**Input:** MI chases CSK's 180, wants position 4  
**Output:** "Chase 181 between 12.3-18.4 overs"

## Project Structure

```
src/
├── App.tsx           # Main app
├── components/       # React components  
├── services/         # API calls
└── main.tsx         # Entry point
```

## Commands

```bash
npm run dev       # Development server
npm run build     # Production build
npm run preview   # Preview production build
npm test          # Run tests
```

## Tech Stack

- **React** + **TypeScript**
- **Vite** for fast development
- **Modern CSS** for styling
- Connects to backend API

## Requirements

- Backend server running on `http://localhost:3000`
- Modern web browser
- Node.js for development

---
**Simple cricket calculations made easy!** 🏏
