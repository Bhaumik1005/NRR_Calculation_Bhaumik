# 🏏 IPL NRR Calculator

A **Net Run Rate (NRR) Calculator** for IPL cricket matches that helps teams understand what they need to do in their next match to reach a desired position in the points table.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)](https://nestjs.com/)

## 🎯 What Does This Do?

**Input:** Team details, match scenario, desired table position  
**Output:** Specific cricket scenarios like:
- *"Restrict opponent between 60-130 runs"*
- *"Chase target between 12.3-18.4 overs"*

Perfect for cricket analysts, team strategists, and fans who want to understand playoff qualification scenarios!

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Start Backend (NestJS API)
```bash
cd backend
npm install
npm run start:dev
# Server runs on http://localhost:3000
```

### 2. Start Frontend (React App)
```bash
cd frontend  
npm install
npm run dev
# App runs on http://localhost:5173
```

### 3. Open & Use
1. Visit `http://localhost:5173`
2. Select teams from the dropdown
3. Enter match details (overs, desired position)
4. Choose batting first or bowling first
5. Get instant NRR calculation results!

## 📋 Features

### ✅ Current Features
- **Live Points Table** - Shows current IPL standings sorted by points and NRR
- **Dual Scenarios** - Handles both batting first and bowling first cases
- **Position Targeting** - Calculate what's needed for specific table positions (1-5)
- **Real Data** - Uses actual IPL team statistics and current standings
- **Instant Results** - Real-time calculations with detailed explanations
- **Clean UI** - Modern, responsive web interface
- **No Database** - Runs entirely from JSON data files

### 🎯 Use Cases
- **Team Strategy** - Plan match approach based on table position goals
- **Fan Analysis** - Understand playoff qualification scenarios
- **Commentary** - Provide insights during live matches
- **Education** - Learn how NRR affects cricket tournaments

## 🏗️ Project Structure

```
📦 IPL_NRR_Calculator/
├── 🎯 backend/                     # NestJS API Server
│   ├── src/
│   │   ├── points/                 # Main business logic
│   │   │   ├── dto/
│   │   │   │   └── calculate-nrr.dto.ts
│   │   │   ├── points.controller.ts    # API endpoints
│   │   │   ├── points.service.ts       # ⭐ Core NRR logic (65 lines!)
│   │   │   └── points.module.ts
│   │   ├── data/
│   │   │   └── pointsTable.json        # Live IPL data
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── .gitignore
│
├── 🎨 frontend/                    # React Web Application  
│   ├── src/
│   │   ├── App.tsx                    # ⭐ Main component
│   │   ├── displayUtils.ts            # Helper functions
│   │   ├── main.tsx                   # React entry point
│   │   └── index.css                  # Styling
│   ├── package.json
│   └── .gitignore
│
└── 📖 README.md                    # This file
```

## 🧮 How NRR Calculation Works

### Formula
**NRR = (Runs Scored Rate) - (Runs Conceded Rate)**

Where:
- **Runs Scored Rate** = Total Runs Scored ÷ Total Overs Faced
- **Runs Conceded Rate** = Total Runs Conceded ÷ Total Overs Bowled

### Example Calculation
```
Team Stats:
- Scored: 1000 runs in 100 overs
- Conceded: 950 runs in 100 overs

NRR = (1000/100) - (950/100) = 10.0 - 9.5 = +0.5
```

### Real Application
If Mumbai Indians need to reach position 3:
1. **Input**: MI scores 180 vs CSK, wants position 3
2. **Process**: Calculate various opponent scores and resulting NRRs
3. **Output**: "Restrict CSK between 72-179 runs in 20 overs"

## 🔧 Tech Stack

### Backend
- **Node.js** + **TypeScript** - Runtime and language
- **NestJS** - Enterprise-grade Node.js framework
- **File System** - JSON data storage (no database needed)

### Frontend  
- **React 18** + **TypeScript** - UI library and language
- **Vite** - Fast development build tool
- **Modern CSS** - Clean, responsive styling
- **Fetch API** - HTTP client for backend communication

## 📡 API Reference

### Base URL: `http://localhost:3000`

#### Get Points Table
```http
GET /points-table
```
**Response:**
```json
[
  {
    "team": "Chennai Super Kings",
    "matches": 7,
    "won": 5,
    "lost": 2,
    "nrr": 0.771,
    "for": "1130/133.1",
    "against": "1071/138.5", 
    "points": 10
  }
]
```

#### Calculate NRR Scenario
```http
POST /calculate-nrr
Content-Type: application/json

{
  "team": "Mumbai Indians",
  "opponent": "Chennai Super Kings", 
  "overs": 20,
  "desiredPosition": 3,
  "tossResult": "Batting First",
  "runsScored": 180
}
```

**Response:**
```json
{
  "textOutputs": [
    "If Mumbai Indians score 180 runs in 20 overs, Mumbai Indians need to restrict Chennai Super Kings between 72 to 179 runs in 20 overs.",
    "Revised NRR of Mumbai Indians will be between -0.25 to 0.54."
  ],
  "structured": {
    "minRuns": 72,
    "maxRuns": 179,
    "minNrr": -0.25,
    "maxNrr": 0.54
  }
}
```

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests  
```bash
cd frontend
npm test
```

### Manual Testing Examples

#### Scenario 1: Batting First
- **Input**: Rajasthan Royals scores 160 vs RCB, wants position 2
- **Expected Output**: "Restrict RCB between 64-159 runs"

#### Scenario 2: Bowling First
- **Input**: Delhi Capitals chases Mumbai's 180, wants position 4  
- **Expected Output**: "Chase 181 between 12.0-19.0 overs"

## 🎮 Usage Examples

### Example 1: Team Strategy
**Scenario**: Mumbai Indians is at position 5, playing Chennai Super Kings next

**Question**: *"What do we need to do to reach position 3?"*

**Steps**:
1. Select "Mumbai Indians" and "Chennai Super Kings"
2. Set desired position to 3
3. Choose toss result and enter runs
4. Get specific strategy: *"Restrict CSK to under 130 runs"*

### Example 2: Fan Analysis
**Scenario**: Understanding playoff qualification

**Question**: *"Can RCB still make it to playoffs?"*

**Steps**:
1. Check current points table
2. Calculate scenarios for remaining matches
3. Determine realistic qualification paths

## 🔍 Key Files to Understand

### Core Logic
- **`backend/src/points/points.service.ts`** - Main NRR calculation (only 65 lines!)
- **`frontend/src/App.tsx`** - Complete UI and state management

### Data & Configuration
- **`backend/src/data/pointsTable.json`** - Current IPL team standings
- **`backend/src/points/dto/calculate-nrr.dto.ts`** - Input data structure

## 🐛 Troubleshooting

### Backend Issues
```bash
# Port already in use
lsof -ti:3000 | xargs kill -9

# Dependencies issues
rm -rf node_modules package-lock.json
npm install

# File path errors - check pointsTable.json location
```

### Frontend Issues  
```bash
# CORS errors - ensure backend is running
# API connection - check API_BASE URL in App.tsx
# Build issues - clear npm cache
npm cache clean --force
```

### Common Problems
1. **"Failed to fetch points table"** → Backend not running
2. **Form validation errors** → Check required fields
3. **Unexpected results** → Verify team names match data exactly

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Submit pull request with clear description

### Code Style
- Use TypeScript for type safety
- Follow existing naming conventions
- Add tests for new functionality
- Keep functions small and focused

## 📈 Future Enhancements

### Planned Features
- [ ] **Historical Data** - Support for previous IPL seasons
- [ ] **Multiple Formats** - ODI and Test match NRR calculations  
- [ ] **Advanced Scenarios** - Rain-affected matches, bonus points
- [ ] **Export Results** - PDF/Excel reports
- [ ] **Real-time Updates** - Live match data integration

### Technical Improvements
- [ ] **Database Integration** - PostgreSQL/MongoDB support
- [ ] **Authentication** - User accounts and saved scenarios
- [ ] **Mobile App** - React Native version
- [ ] **Performance** - Caching and optimization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Bhaumik** - *Initial work and development*

## 🙏 Acknowledgments

- **IPL** for providing exciting cricket data
- **NestJS & React** communities for excellent frameworks
- **Cricket statisticians** for NRR calculation methodologies

---

## 🎯 Quick Demo

Want to see it in action? Here's a 30-second demo:

1. **Start both servers** (backend + frontend)
2. **Visit** `http://localhost:5173`
3. **Select**: Mumbai Indians vs Chennai Super Kings  
4. **Input**: MI bats first, scores 180, wants position 3
5. **Result**: "Restrict CSK between 72-179 runs" ⚡

**Perfect for cricket strategists, analysts, and passionate fans!** 🏏

---

<div align="center">

**⭐ Star this repo if you find it useful! ⭐**

[Report Bug](https://github.com/yourusername/ipl-nrr-calculator/issues) • [Request Feature](https://github.com/yourusername/ipl-nrr-calculator/issues) • [Documentation](https://github.com/yourusername/ipl-nrr-calculator/wiki)

</div>
