# DigyNex 360 | Intelligence Engine Options & Data Map

This document serves as a reference for the autonomous intelligence modules within the DigyNex 360 Dashboard. Use these descriptions for presentations, client onboarding, and technical documentation.

---

## 1. Database Live Sync
**Core Purpose:** Demonstrates real-time infrastructure health and data integrity.
- **Dashboard Message:** "AI is identifying performance drivers for 'Database Live Sync'..."
- **Drill-down Data Points:**
  - **Supabase V3 Edge:** Confirms the active cloud node handling the request.
  - **Infrastructure Hook:** Shows system latency (e.g., 12ms) to prove high-speed processing.
  - **BI Ledger Sync:** Shows batch numbers to prove synchronization with the financial records.
- **Visuals:** Emerald green accents representing "Safety" and "Sync".

## 2. Target Benchmark
**Core Purpose:** Tracks current financial velocity against pre-defined KPIs.
- **Dashboard Message:** "AI is identifying performance drivers for 'Target Benchmark'..."
- **Drill-down Data Points:**
  - **Direct Sales Path:** Revenue breakdown vs projected targets.
  - **Operational Burden:** Identifies where expenses are exceeding the budget (Red Highlighted).
  - **Growth Buffer:** The net profit margin optimized by the AI.
- **Visuals:** Blue and Red accents representing "Growth" and "Risk".

## 3. Financial Anomaly (Anomaly Alerts)
**Core Purpose:** Instant risk mitigation and suspicious activity detection.
- **Dashboard Message:** "AI is identifying performance drivers for 'Anomaly Alerts'..."
- **Drill-down Data Points:**
  - **POS Terminal B:** Physical hardware transactions.
  - **Web Gateway:** Online sales gateway traffic.
  - **Wire Transfer:** High-value movements requiring "Pending Clearance" (Yellow Highlighted).
- **Visuals:** Amber and Red accents representing "Caution" and "Urgency".

---

## Technical Summary for Presentation
| Module | Technology Layer | Business Impact | 
| :--- | :--- | :--- | 
| **Sync Engine** | Supabase Real-time / Deno Edge | Zero-latency decision making |
| **Forecasting** | Linear Regression / Pattern Matching | Predictive budget safety |
| **Anomaly** | Outlier Detection Algorithms | Fraud prevention & cost leakage stop |

---
**Maintenance Note:** This file is synchronized with `src/components/dashboard/DrilldownModal.vue` logic.
