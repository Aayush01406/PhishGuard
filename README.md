# PhishGuard

PhishGuard is a premium cybersecurity SaaS application that helps users detect phishing websites in real time. This is the core product focused on the phishing detection platform without any authentication.

## Tech Stack

### Backend
- **Python** - Programming language
- **FastAPI** - Web framework
- **SQLAlchemy** - ORM
- **SQLite** - Database (for development)

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Features

### Phase 1 (Core Features)
- ✅ Landing Page - Modern, premium SaaS landing page
- ✅ Dashboard - Overview with statistics and recent scans
- ✅ URL Scanner - Interactive scanner with animations
- ✅ Scan Results - Detailed risk analysis with visualizations

### Phase 2 (Analysis Engine)
- ✅ Risk Scoring Engine - 0-100 risk score calculation
- ✅ URL Analysis Engine - URL structure and pattern analysis
- ✅ SSL Checker - SSL certificate validation
- ✅ Domain Age Checker - Domain age verification (demo implementation)
- ✅ URL Structure Analyzer - Comprehensive URL feature extraction

### Phase 3 (Management Features)
- ✅ Blocked Domains Management - View and manage blocked domains
- ✅ Scan History - Complete history of all URL scans
- ✅ Threat Analytics - Visual analytics dashboard

## Getting Started

### Prerequisites
- Python 3.8 or higher
- Node.js 18 or higher

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment (recommended):
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   The backend will be available at http://localhost:8000

   API docs will be available at http://localhost:8000/docs

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at http://localhost:5173

## Usage

1. Open your browser and go to http://localhost:5173
2. You'll land on the beautiful landing page
3. Click "Go to Dashboard" or "Start Scanning Now"
4. Use the URL Scanner to check any website
5. View detailed scan results, risk scores, and recommendations
6. Check your scan history and blocked domains in the respective sections

## Application Structure

```
PhishGuard/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── scans.py          # URL scanning endpoints
│   │   │   └── blocked_domains.py # Blocked domains endpoints
│   │   ├── models/
│   │   │   ├── url_scan.py      # URL scan database model
│   │   │   └── blocked_domain.py # Blocked domain model
│   │   ├── schemas/
│   │   │   ├── url_scan.py      # Pydantic schemas for scans
│   │   │   └── blocked_domain.py # Pydantic schemas for blocked domains
│   │   ├── services/
│   │   │   └── phishing_detector.py # Main phishing detection engine
│   │   ├── core/
│   │   │   ├── config.py        # Configuration
│   │   │   └── database.py      # Database setup
│   │   └── main.py              # FastAPI application entry point
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.tsx      # Landing page
│   │   │   ├── Dashboard.tsx    # Main dashboard
│   │   │   ├── Scanner.tsx      # URL scanner
│   │   │   ├── History.tsx      # Scan history
│   │   │   ├── BlockedDomains.tsx # Blocked domains
│   │   │   ├── Analytics.tsx    # Threat analytics
│   │   │   └── Settings.tsx     # Settings page
│   │   ├── components/
│   │   │   └── Sidebar.tsx      # Sidebar navigation
│   │   ├── lib/
│   │   │   └── api.ts           # API client
│   │   ├── App.tsx              # Main app component
│   │   ├── main.tsx             # App entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Phishing Detection Features

The phishing detection engine analyzes:
- **HTTPS Usage** - Checks if the site uses secure HTTPS
- **SSL Certificate** - Validates SSL certificate status
- **URL Length** - Longer URLs are often suspicious
- **Number of Dots** - Excessive subdomains can indicate phishing
- **Hyphens in Domain** - Often used to mimic legitimate sites
- **@ Symbol in URL** - A common phishing technique
- **IP Address instead of Domain** - Highly suspicious
- **URL Shorteners** - Used to hide malicious destinations
- **Suspicious Keywords** - Words like "login", "verify", "account", etc.

## Future Enhancements

### Phase 4 - Machine Learning
- Train ML model on real phishing datasets
- Implement Random Forest classifier
- Add model training and evaluation endpoints

### Phase 5 - Browser Extension
- Chrome extension for real-time URL scanning
- Automatic blocking of phishing sites
- Browser integration

## Contributing

This is a demo SaaS product focused on core phishing detection features. Authentication will be added later (Google OAuth only).

## License

MIT
