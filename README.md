# TraceAI — Enterprise Financial Investigation & Reconciliation Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-traceai--rouge.vercel.app-2563eb?style=for-the-badge&logo=vercel&logoColor=white)](https://traceai-rouge.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/somyamishra454-code/traceai)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **"Where did the money go, and what should I do about it?"**

🌐 **Live Production Application**: **[https://traceai-rouge.vercel.app/](https://traceai-rouge.vercel.app/)**  
📂 **GitHub Repository**: **[https://github.com/somyamishra454-code/traceai](https://github.com/somyamishra454-code/traceai)**

TraceAI is an enterprise-grade autonomous financial investigation and reconciliation platform built for fintech, treasury, and operations engineering teams. It continuously monitors multi-gateway settlements, bank core banking system (CBS) feeds, and ERP general ledgers to autonomously isolate discrepancies, trace root causes across APIs and webhooks, generate double-entry balancing journal entries, and dispatch forensic evidence packages.

---

## 🚀 Key Modules & Capabilities

### 1. ⚡ Real-Time Ingestion & Settlement Stream
- Live streaming pipeline cross-verifying **Razorpay Route**, **HDFC Bank CBS Host-to-Host**, and **Stripe Direct** feeds.
- Live throughput ticker (`48 txns/sec`), automated 2-way verification badges, stream pause/resume toggle, and high-velocity batch surge simulation (`+250 txns in 18ms`).

### 2. ⏳ Forensic Ledger Time-Travel Scrubber
- Interactive 5-step scrubber to inspect the exact historical evolution of ledger breaks:
  1. `03:30 AM` — Razorpay Batch Payout Generated (`₹48,000.00` across 14 transactions).
  2. `03:45 AM` — HDFC Bank Host-to-Host Deposit Cleared (UTR `#HDFCR5202609040019284`).
  3. `04:01 AM` — ERP Webhook Connector Timeout (`HTTP 504 Gateway Timeout` — **Disruption Point**).
  4. `04:14 AM` — TraceAI Automated Anomaly Flagged (`₹48,000 Mismatch Detected`).
  5. `04:14:29 AM` — Autonomous Balancing Journal Entry (`#JE-2026-904 Created`).
- Features **Play Sequence / Autoplay**, **Jump to Break Point**, and detailed multi-ledger state inspector.

### 3. 🌐 Animated Flow Canvas Rail
- Telemetry rail visualizing money custody from Customer Charges → Batch Settlement → Bank CBS → Webhook API Connector → Accounting Ledger.
- Animated particle pulses traveling across nodes with fracture visualization at the HTTP 504 break point and 1-click raw JSON payload export.

### 4. 🔬 Multi-Stage AI Investigation Workstation
- 6-Stage deterministic execution pipeline:
  - **Stage 1: Detect** — Settlement anomaly discovery.
  - **Stage 2: Collect** — Raw MT940 statement, webhook logs, and general ledger accounts ingestion.
  - **Stage 3: Correlate** — 14 payment aggregation cross-referencing and fee delta verification.
  - **Stage 4: Investigate** — HTTP 504 timeout isolation on ERP connector.
  - **Stage 5: Explain** — 94% confidence root cause synthesis.
  - **Stage 6: Recommend** — Balancing journal entry generation & webhook retry.
- Real-time execution console with customizable speed controls (**1x**, **2x**, **Instant**).

### 5. 📧 Automated Forensic Report Email Dispatch
- Integrated 1-click modal to email company leadership and external partners:
  - **Presets**: CFO & Board (`cfo-office@fintech.corp`), Finance Controller, Razorpay Escalation, HDFC Corporate CMS, Statutory Auditor.
  - **Attachments**: MT940 Bank Credit Statement, Razorpay Payout Payload, Balancing Journal Entry Certificate.
  - Non-intrusive bottom-right toast notification system.

### 6. ⚖️ Double-Entry Balancing & Webhook Replay
- Double-entry journal balance view (`DR HDFC Bank Current A/c 8890 ₹48,000.00 / CR Gateway Clearing A/c 1150 ₹48,000.00`).
- Idempotent webhook re-trigger simulator to synchronize ERP status to reconciled.

### 7. 📄 Executive Audit Storyboard
- CFO and auditor sign-off memorandum with printable / PDF-ready formal audit certificates, timeline events, and cryptographically signed resolution hashes.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript (Strict `verbatimModuleSyntax`)
- **Build Tool**: Vite 8.2.2
- **Styling**: TailwindCSS v4 + Custom Dark FinTech Design System
- **Routing**: React Router v7
- **Icons**: Lucide React
- **State Engine**: React Context with dynamic simulation engines for live transaction streaming, time travel stepping, and toast dispatch.

---

## 📦 Running Locally

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Startup
```bash
# Navigate to project directory
cd "C:\Users\Lenovo\.gemini\antigravity-ide\scratch\tracepay-ai"

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
tracepay-ai/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── AppLayout.tsx              # Sidebar navigation, top search, case badges, status
│   │   ├── modals/
│   │   │   └── SendReportEmailModal.tsx   # Forensic report email dispatcher modal
│   │   └── shared/
│   │       ├── LiveTransactionStream.tsx # Real-time stream ticker & surge simulation
│   │       ├── TimeTravelScrubber.tsx     # Historical ledger time-travel scrubber
│   │       ├── FlowCanvasRail.tsx         # Animated SVG flow rail & break visualization
│   │       ├── ToastNotification.tsx      # Toast notifications manager
│   │       ├── StatusBadge.tsx            # Semantic financial status badges
│   │       └── AnimatedCounter.tsx        # High-precision numeric transition counter
│   ├── data/
│   │   └── financialContext.tsx           # Global state, cases store, runner, streaming engine
│   ├── pages/
│   │   ├── CommandCenter.tsx              # KPI overview, live stream, active case spotlight
│   │   ├── InvestigationInbox.tsx         # Triage queue with filters & quick inspection drawer
│   │   ├── InvestigationWorkspace.tsx     # 3-zone workstation, stages runner, speed controls
│   │   ├── EvidenceGraphPage.tsx          # Forensic custody flow chain & variance matrix
│   │   ├── ResolutionCenter.tsx           # Balancing journal entry & webhook replay
│   │   ├── ExecutiveStoryboard.tsx        # CFO audit memorandum & print export
│   │   └── SettingsPage.tsx               # Connectors, tolerances, and automated email rules
│   ├── App.tsx                            # React router routes
│   ├── index.css                          # FinTech design tokens & keyframe animations
│   └── main.tsx                           # Application entry point
├── package.json
└── README.md
```
