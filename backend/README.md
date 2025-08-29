# 🏏 Backend API

Simple Node.js server for IPL NRR calculations.

## Quick Start

```bash
npm install
npm run start:dev
```

Server runs on `http://localhost:3000`

## What It Does

- **GET /points-table** - Returns current IPL standings
- **POST /calculate-nrr** - Calculates NRR scenarios

## Example API Call

```bash
curl -X POST http://localhost:3000/calculate-nrr \
  -H "Content-Type: application/json" \
  -d '{
    "team": "Mumbai Indians",
    "opponent": "Chennai Super Kings",
    "overs": 20,
    "desiredPosition": 3,
    "tossResult": "Batting First",
    "runsScored": 180
  }'
```

## Project Structure

```
src/
├── points/
│   ├── points.service.ts   # Main calculation logic
│   └── points.controller.ts # API endpoints
├── data/
│   └── pointsTable.json    # IPL team data
└── main.ts                 # Server startup
```

## Key File

All the NRR calculation logic is in `src/points/points.service.ts` - only ~65 lines of code!

## Commands

```bash
npm run start:dev    # Development server
npm run build        # Production build  
npm run start:prod   # Production server
npm test             # Run tests
```

## Tech Stack

- **Node.js** + **TypeScript**
- **NestJS** framework
- **JSON file** for data (no database needed)

## How It Works

1. Loads IPL team data from JSON file
2. Calculates what teams need to do to reach desired positions
3. Returns realistic cricket scenarios
4. Handles both batting first and bowling first cases

---
**Simple, clean, and ready to use!** 🚀
