# Admin Dashboard – User Analytics & CSS Generator

A full-stack web application designed for real-time web traffic analytics, IP-to-country geolocation mapping, realistic simulated request streaming, and a powerful **CSS Generator & Appearance Customizer** with custom column mapping, custom headers, live previews, and dynamic theme styling.

Built with **React 19**, **Vite**, **Tailwind CSS**, **Recharts**, **Lucide Icons**, **Node.js**, **Express 5**, and high-performance **SQLite (better-sqlite3)**.

---

## 📸 Architecture & Design Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              Admin Dashboard – User Analytics & CSS Generator               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌───────────────────┐    ┌─────────────────────────────────────────────┐  │
│   │   Sidebar Nav     │    │                 Topbar                      │  │
│   │ ───────────────── │    │  • Date Filter (Today, 7D, 30D, All)        │  │
│   │ 1. Overview       │    │  • Live Traffic Pulse Indicator             │  │
│   │ 2. User Analytics │    │  • Quick "Simulate Traffic (+5)" Button     │  │
│   │ 3. IP Lookup      │    │  • Digital Clock & Auto Refresh Indicator   │  │
│   │ 4. Simulator      │    └─────────────────────────────────────────────┘  │
│   │ 5. CSS Generator  │                                                     │
│   │ 6. Settings       │    ┌─────────────────────────────────────────────┐  │
│   └───────────────────┘    │              Active View Body               │  │
│                            │  • KPI Overview Cards (Visitors, IPs, etc.) │  │
│                            │  • Recharts Visitors & Page Views Area Chart│  │
│                            │  • Visitors by Country Progress Bars & Flags│  │
│                            │  • Browser / OS Distribution Charts         │  │
│                            │  • Live Incoming Web Requests Feed          │  │
│                            └─────────────────────────────────────────────┘  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST APIs (JSON / CSS)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Node.js & Express 5 Backend                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  • GeoIP Engine: IP-to-country resolver with flag emojis, cities, and ASNs  │
│  • Traffic Simulator: Realistic IP pools, browsers, OS, routes, and latencies│
│  • CSS Generation Service: Column selection, header aliases, CSS escaping   │
│  • SQLite Database: better-sqlite3 with WAL mode, indexing, and aggregations│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Modules & Core Capabilities

### MODULE 1: USER ANALYTICS

#### 1.1 Simulate Web Requests from Multiple IPs
- **Realistic Traffic Engine**: Simulates visits with authentic public IP subnets from over 15 countries (USA, UK, Germany, Japan, India, France, Canada, Australia, Brazil, Sweden, Netherlands, etc.).
- **Rich Request Payloads**: Each simulated entry records:
  - Client IP Address
  - Country name, ISO 2-letter code, and unicode flag emoji
  - City, continent, and approx latitude / longitude coordinates
  - Timestamp (ISO 8601 with relative time display)
  - Browser family and version (Chrome 130, Safari 18, Firefox 132, Edge, Opera)
  - Operating system & device type (Windows 11, macOS Sequoia, iOS 18, Android 15, Linux)
  - Target page visited (`/`, `/pricing`, `/features`, `/docs/api`, `/dashboard`, etc.)
  - HTTP Status code (200, 201, 304, 404) and response latency (ms)
- **Primary Action**: Dedicated **"Simulate Traffic"** button with volume batch selectors (+1, +5, +10, +25, +50 requests) and continuous streaming mode.
- **Live Updating Table & Feed**: Incoming requests immediately update the dashboard KPI metrics and live feeds.
- **Safe & Ethical**: Purely simulated in-memory and database records; no external scraping, unauthorized traffic generation, or socket spoofing.

#### 1.2 IP-to-Country Mapping
- **Interactive GeoIP Lookup Tool**: Search any arbitrary IPv4 address or localhost loopback.
- **Detailed Geographic Profile**: Returns Country Name, ISO Code, Flag icon/emoji, City, Continent, Coordinates, Network Provider / ASN, and Public/Private subnet detection.
- **Pre-Configured Test IPs**: 1-click test buttons for popular global endpoints (Google DNS, Cloudflare, Deutsche Telekom, Reliance Jio, Fastly London, Claro Brasil, KDDI Japan).
- **Offline Resilient Database**: High-fidelity subnet matching with deterministic fallback ensures consistent resolution without third-party API dependencies.

#### 1.3 Dynamic Admin Dashboard
- **Live KPI Overview Cards**:
  - Total Visitors
  - Unique IP Addresses
  - Number of Countries
  - Total Page Views
  - Average Response Time (ms) & Success Rate (%)
- **Visual Analytics Charts**:
  - **Visitors & Page Views Over Time**: Smooth interactive Area chart with gradient fills and tooltips.
  - **Visitors by Country**: Progress distribution with flag emojis, visit counts, and market share percentages.
  - **Traffic Distribution**: Browser share Donut chart, Operating System horizontal bar chart, and top requested web routes.
- **Date Filters**: One-click switching between **Today**, **Last 7 Days**, **Last 30 Days**, and **All Time** with reactive data re-aggregation.

---

### MODULE 2: CSS GENERATOR

#### 2.1 Customize Appearance
- **Exported Data Customization**:
  - **Select Columns**: Choose any combination of 15 available columns (`ip_address`, `country_name`, `country_code`, `city`, `continent`, `timestamp`, `browser`, `os`, `device_type`, `page_visited`, `referrer`, `status_code`, `response_time_ms`, etc.) using checkboxes.
  - **Custom Column Names**: Easily rename attributes for reporting (e.g., change `ip_address` to `Client IP`, or `country_name` to `User Location`).
  - **Date Range Selection**: Filter data by Today, Last 7 Days, Last 30 Days, or custom Start/End dates.
  - **Header Toggle**: Choose whether to output header attributes in the CSS dataset.
  - **Live Preview Before Downloading**:
    - **Valid CSS Code View**: Real-time syntax-highlighted CSS stylesheet with custom properties (`:root`, `.analytics-record[data-row="..."]`).
    - **Data Grid View**: Tabular preview of the records formatted with your custom column aliases.
- **Appearance & Theme Customization Studio**:
  - Interactive theme builder for administrators:
    - Primary Brand Accent Color picker (Blue, Indigo, Emerald, Purple, Amber, Rose, Cyan)
    - Table Corner Radius (4px, 8px, 12px, 16px)
    - Row Density / Spacing (Compact, Normal, Spacious)
    - Zebra Striping toggle
    - Live Interactive Component Preview (styled table with custom badges)
    - Live Generated CSS Theme Code box
    - **"Apply Theme to Dashboard"** button (live hot-reloads dashboard styles in real-time)
    - **"Download Theme CSS"** button (`dashboard-theme.css`)

#### 2.2 Download CSS File
- **Download CSS Button**: Click **"Download CSS"** to generate and download a valid CSS stylesheet file using the selected data.
- **Valid CSS Output**: Generates valid CSS stylesheets containing `:root` custom properties, record attributes, and table layout styling.
- **Meaningful Filename**: Defaults to `user_analytics.css`, with custom filename editing.
- **Proper Escaping**: Quotes, backslashes, commas, and special characters inside CSS strings are properly escaped.

---

## 📂 Project Folder Structure

```
admin-analytics-dashboard/
├── package.json               # Root dependencies & runner scripts
├── test-suite.js              # Automated verification test suite
├── README.md                  # Comprehensive documentation
├── server/                    # Node.js & Express 5 Backend
│   ├── index.js               # Express server entry point & static SPA fallback
│   ├── data/                  # SQLite database storage (WAL mode)
│   │   └── analytics.db       # Persistent SQLite file
│   ├── db/
│   │   ├── database.js        # better-sqlite3 connection, queries & aggregations
│   │   └── seedData.js        # Deterministic seeding engine for demo records
│   ├── routes/
│   │   ├── analytics.js       # KPI metrics, time-series, country breakdown
│   │   ├── simulator.js       # Traffic simulation generation endpoints
│   │   ├── ipLookup.js        # IP geolocation resolution endpoint
│   │   ├── cssExport.js       # CSS preview and file download routes
│   │   └── settings.js        # Database reset, seed volume, system telemetry
│   └── services/
│       ├── geoService.js      # GeoIP subnet database, flags & ASNs
│       ├── simulatorService.js# Realistic request synthesizer
│       └── cssService.js      # Valid CSS stylesheet dataset generator
└── frontend/                  # React 19 Frontend (Vite + Tailwind CSS)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx            # Main app shell, navigation router & global state
        ├── main.jsx           # React DOM root entry
        ├── services/
        │   └── api.js         # Axios API client for backend endpoints
        └── components/
            ├── layout/
            │   ├── Sidebar.jsx    # Sidebar navigation (6 views)
            │   ├── Topbar.jsx     # Header with date filters, clock & quick simulate
            │   └── StatCard.jsx   # Reusable KPI metric card
            ├── overview/
            │   ├── OverviewMetrics.jsx   # 5 key metric cards
            │   ├── VisitorsChart.jsx     # Recharts Area time-series
            │   ├── CountryChart.jsx      # Country progress bars with flags
            │   ├── DistributionCharts.jsx# Browser donut, OS bar & top pages
            │   └── RecentVisitorsFeed.jsx# Live incoming web requests feed
            ├── analytics/
            │   ├── AnalyticsTable.jsx    # Search, multi-filters & pagination
            │   └── RequestDetailModal.jsx# Deep JSON request inspector
            ├── iplookup/
            │   └── IpLookupTool.jsx      # Interactive GeoIP search & test IPs
            ├── simulator/
            │   └── TrafficSimulatorPanel.jsx# Batch & auto-continuous simulator
            ├── css/
            │   └── CssGeneratorWizard.jsx   # CSS generator + theme customizer
            └── settings/
                └── SettingsView.jsx      # Database management & seed controls
```

---

## 🚀 Installation & Running Locally

### Prerequisites
- **Node.js** v18+ or v20+ or v22+
- **npm** v9+ or v10+

### Step 1: Install Dependencies
From the project root directory:

```bash
cd admin-analytics-dashboard
npm install
npm --prefix frontend install
```

### Step 2: Build Frontend (Production Ready)
```bash
npm run build:client
```

### Step 3: Start Application
You can run the full-stack app in either production or development mode:

#### Option A: Unified Production Server (Recommended)
Serves both backend APIs and the compiled frontend on a single port:
```bash
npm start
```
The application will be live at **http://localhost:5000**.

#### Option B: Concurrent Development Mode
Runs Express backend on `http://localhost:5000` and Vite dev server on `http://localhost:5173` with hot module replacement (HMR):
```bash
npm run dev
```

### Step 4: Run Automated Verification Tests
To run the automated test suite verifying SQLite persistence, GeoIP lookup, traffic simulation, and CSS dataset generation:
```bash
npm test
```

---

## 📡 API Reference Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/analytics/overview` | KPI overview statistics (filtered by date) |
| `GET` | `/api/analytics/charts` | Time-series and geographic breakdown data |
| `GET` | `/api/analytics/requests` | Paginated, filtered, and sorted request logs |
| `GET` | `/api/analytics/filters` | Distinct filter options (countries, browsers, OS) |
| `POST` | `/api/simulator/simulate` | Generate 1 to 200 realistic simulated web requests |
| `GET` | `/api/simulator/recent` | Get latest incoming simulated requests |
| `GET` | `/api/ip-lookup/:ip` | GeoIP lookup with country, flag, city, and ASN |
| `GET` | `/api/ip-lookup/samples` | Curated sample IP addresses from around the globe |
| `GET` | `/api/css/columns` | Available exportable attributes and metadata |
| `POST` | `/api/css/preview` | Live preview for data grid and valid CSS rules |
| `POST` | `/api/css/download` | Download valid `.css` file with custom aliases |
| `POST` | `/api/settings/reset` | Purge request database |
| `POST` | `/api/settings/seed` | Seed database with realistic historical requests |
