# 👑 DIGYNEX PROJECT HUB: Unified SaaS Roadmap

This document serves as the **Single Source of Truth** for the DigyNex Ecosystem. All architectural decisions, pricing models, and development milestones are documented here.

---

## 💰 UNIFIED PRICING STRATEGY (GLOBAL SaaS)

The pricing is designed as a **Hybrid Model**: Full-Suite Platform Pricing vs. Individual Sub-Product Entry Plans.

### 1. Main Platform Pricing (digynex.se/pricing)
*Targeting: Medium-Large Enterprises & Full Business Management*

| Tier | Price (Monthly) | Setup Fee | Active Profiles | Key Value |
| :--- | :--- | :--- | :--- | :--- |
| **STARTER** | **$29** | **$99** | Up to 100 | Basic dashboards & core records. |
| **GROWTH** ⭐ | **$79** | **$199** | Up to 500 | **Nexus AI Business Agent** & full automation. |
| **SCALE** | **$149** | **$499** | Up to 2,000 | **Custom-Trained AI Agent** & multi-org ops. |
| **ENTERPRISE** | **Custom** | **$999+** | Unlimited | Dedicated API & specialized custom models. |

---

### 2. Sub-Product (Micro-SaaS) Entry Pricing
*Targeting: Individual modules (CMS, TMS, FB Nexus)*

| Tier | Price (Monthly) | Setup Fee | Features |
| :--- | :--- | :--- | :--- |
| **STARTER** | **$19** | **$99** | Up to 100 Profiles, Basic CRM, 24/7 Monitoring. |
| **GROWTH** ⭐ | **$29** | **$199** | Up to 500 Profiles, **Nexus AI Business Agent**, n8n. |
| **SCALE** | **$79** | **$499** | Up to 2,000 Profiles, **Custom AI Agent**, White-Label. |

*Upsell CTA: "Unlock the Full Suite for $149/mo (All-in-one)"*

---

### 3. Market Detection & Currency Logic
- **SE (Sweden):** 
  - Monthly: 299 kr / 799 kr / 1499 kr
  - Setup: 999 kr / 1,999 kr / 4,999 kr
- **LK (Sri Lanka):** 
  - Monthly: 2,500 / 12,000 / 18,000 LKR
  - Setup: 12,000 / 18,000 / 30,000 LKR
- **GLOBAL:** 
  - Monthly: $29 / $79 / $149
  - Setup: $99 / $199 / $499

---

## 🎨 VISUAL IMPLEMENTATION PLAN (PREMIUM UI/UX)

Following the Figma Blueprint, we will implement a world-class pricing page on `digynex.se`:

### 1. Hero & Billing Toggle
- **Smooth Toggle:** Monthly vs. Yearly switch (Yearly saves 20%).
- **Clean Headline:** "Simple Pricing. Decision Intelligence."

### 2. The Pricing Grid (Glassmorphism Tier)
- **Design Style:** Translucent dark backgrounds with subtle borders.
- **Micro-Animations:** On hover, cards lift and shadows deepen.
- **Growth Card Glow:** A subtle, pulsating gradient border (Blue-Purple) to drive conversion.
- **Badging:** "Most Popular" for the Growth tier.

### 3. Progressive Disclosure
- **Tooltips:** Information icons for "Active Profiles" explaining the metric simply.
- **Comparison Table:** A minimalist table below the cards for detailed feature comparison.
- **FAQ Section:** Accordion-style section for common queries (Profiles, Upgrades, Trial).

---

## 📊 DIGYNEX 360: BI INTERACTIVITY (EXECUTIVE BOARD)

The Executive Board is a **Decision Intelligence Interface**. Every element is interactive, allowing for deep-dive analysis.

### 1. KPI Card Drill-downs (DrilldownModal)
- **Unified Revenue:** Clicking the main hero card triggers a drill-down into automated subscription fees and batch processing revenue.
- **Net Profit (P&L Context):** Triggers a **High-Fidelity ApexChart** showing Profit vs. Revenue trends over time, alongside specific margin metrics (Peak Margin: 28.4%).
- **Liquidity Radar (Free Cash Flow):** Provides a 30-day cash cycle insight including operational reserves and receivables.
- **Expense Auditor (Op. Expenses):** Breaks down monthly burn into Cloud Infrastructure, Marketing, and Payroll with budget-status indicators.

### 2. Action Engine (Notification System)
- **Top Header Bell:** A pulsating indicator for real-time alerts.
- **Dropdown Interface:** Displays categorized system events:
  - **Anomaly Detection:** WoW revenue drops or unusual expense spikes.
  - **Intelligence Sync:** Confirmation of AI Forecast Path recalculation via Supabase.
  - **Strategic Updates:** Alerts on growth target adjustments based on monthly metrics.
- **Click Actions:** Each notification item is interactive, allowing for "Mark as Read" or "Drill-to-Detail" navigation.

### 3. Executive Export (PDF Reporting)
- **Export Button:** A state-managed button in the header.
- **Process Sequence:** 
  1. Compiling AI Intelligence Report...
  2. Encrypted stream validation.
  3. PDF Graphics generation.
  4. Automatic file download.

---

### 4. Sales Pivot Analysis (Drill-down Ecosystem)

The Sales Pivot page is a **Multi-dimensional Channel Auditor**. It allows for granular tracking of lead sources and conversion efficiency.

#### 📈 Interactive Sales Metrics
- **Avg Order Value:** Clicking triggers a drill-down into higher-tier plan (Platinum/Growth) performance.
- **Conversion Rate:** Insights into channel efficiency (PPC vs. Organic SEO) via a detailed modal.
- **Total Orders:** Audit of order velocity, showing batch-processing success vs. pending transactions.
- **New Customers:** A verified list of corporate vs. individual SaaS signups.

#### 📊 Revenue by Channel (Interactive Chart)
- **Bar Selection:** Clicking any channel (ex: Facebook Ads, Google Search) triggers a **Channel Analysis** modal with specific share metrics and aggregate revenue.
- **Live Sync:** Data is pulsed from Supabase to provide real-time marketing distribution.

#### 🛠 Operational Controls
- **"This Month" (Timeframe Sync):** Resets the data context to the current billing cycle, recalculating MoM (Month-over-Month) trends.
- **Export Report:** Generates a **Sales Intelligence Manifest**, validating channel mix before downloading the PDF.

---

### 5. BI Intelligence Reports (Automation Hub)

The BI Reports page is a **Centralized Automation Workstation** for scheduling and generating executive-grade business intelligence.

#### 🧠 Intelligence Monitoring
- **Intelligence Sync:** Real-time database architecture health monitoring.
- **Automation Pulse:** Tracking active n8n logic hooks and system triggers.
- **Managed Data:** Auditor for the total volume of data points processed by the DigyNex Hub.

#### ⚙️ Custom Report Builder (High-Fidelity)
- **Context Selection:** Allows for "Metric Universe" and "Time Horizon" customization.
- **AI Synthesis Toggle:** Option to inject automated executive summaries into the final PDF.
- **Compilation Workstation:** A dynamic overlay that shows real-time progress (0-100%) through 4 stages:
  1. Authenticating Ledger Access.
  2. Applying AI Heuristics.
  3. Injecting Synthetic Summaries.
  4. Signing Encrypted Manifest.
- **Data Preview:** A mini sparkline and metadata block providing a "pre-flight" look at report density and accuracy.

#### 📅 Automated Schedule Hub
- **Interactive Toggles:** Users can "Active/Pause" specific automation sequences (Monthly Audits, Weekly Pivots) with real-time status indicators.
- **Operational Logs:** Tracks the "Last Run" status for every scheduled job to ensure system reliability.

---

### 6. Operational Efficiency (Infrastructure Monitor)

The Operations page is a **Live Performance Dashboard** for monitoring system health, worker latency, and AI optimization protocols.

#### 📡 Real-time Heartbeat
- **KPI Monitoring:** Drill-down access to Platform Uptime, Lead Response Latacy, and Workload Density.
- **Sub-System Monitoring:** Status indicators for critical nodes including Supabase, n8n Cloud, and Global CDNs.

#### ⚡ AI Efficiency Pulse
- **Optimization Engine:** An interactive workstation that detects latency spikes and suggests core-sharding protocol adjustments.
- **Execution Lifecycle:** A state-managed optimization sequence that rebalances worker throughput and stabilizes system latency (Target: 12ms).

#### 📊 Throughput & Process Audit
- **Multi-threaded Monitor:** Area charts visualizing global throughput flux across distributed workers (Worker A, B, C).
- **Workflow Log Auditor:** A detailed manifest of the latest process identifier executions (Subscription Batches, Edge Syncs, Hub Relays) with specific request success rates.

---

### 7. Financial Intelligence Vault (Ledger Control)

The Finance page is an **Executive Decision Vault** for managing multi-tenant liquidity and strategic ledger entries.

#### 📊 Quarterly Compliance Audit
- **Executive Reporting Module:** High-fidelity reporting console showing $1.2M Net Revenue, Sector Allocations (Infra, AI Compute), and Growth Projections.
- **Admin Certification:** Integrated "Super Admin" review feature with signed executive notes for quarterly audits.

#### 📜 Strategic Ledger Audit
- **Full History Manifest:** A high-fidelity, full-screen audit interface for reviewing unrestricted transaction history with automated summary statistics (Revenue Sum, Expense Sum).
- **Transaction Sovereignty:** Row-level action menus for verifying integrity via blockchain simulation, downloading secure receipts, and archiving sensitive records.

#### ✍️ Administrative Record Entry
- **Ledger Ingestion Modal:** A premium interface for committing new SaaS revenue or operational expenses to the strategic ledger with immediate KPI synchronization.
- **AI Integrity Validation:** Real-time data validation and encryption protocols for every committed transaction record.

---

### 8. Organizational Control (Settings)

The Settings module provides central governance over branding, localization, and security protocols.

#### 🏢 Global Branding & Localization
- **Product Identity Management:** Direct control over the enterprise name (DigyNex 360) and version suffix, reflected instantly across the entire multi-tenant dashboard.
- **Reactive Currency Synchronization:** A centralized `brandingStore` ensures that switching between **LKR, SEK, USD, or EUR** propagates real-time updates to all financial data points—including KPI cards, interactive charts, and ledger audit logs—eliminating cold-coded prefixes and ensuring global operational alignment.
- **State Persistence:** UI-aware initialization in the Settings module ensures user preferences are remembered and correctly rendered between navigation cycles.

#### 🛡️ Security Governance
- **Audit Granularity:** Real-time selection of Security Audit Log levels (Minimal, Standard, Strict) to balance performance and compliance.
- **Transactional Persistence:** Premium save sequence ensuring global business rules are locked and propagated across the cloud ecosystem.

### 9. THE STRATEGIC CORE FLOW (SERVICE & PROJECT OPS)

DigyNex 360 acts as a **Managed Services Workflow Engine**, transitioning Purchase Orders into verified Invoices.

#### 📝 Purchase Order (PO) Module
- **Input Context:** Client Name, PO Number, Total Project Budget, Start Date.
- **Approval Gate:** Once "Approved," it is eligible for WO Conversion.

#### ⚙️ Work Order (WO) Transformation
- **Logic:** Each PO can spawn one or more Work Orders.
- **Control:** Assign a **Project Supervisor (Admin)** and a **Subcontractor / Technician (from CMS)**.
- **Visibility:** Real-time budget consumption vs. assignment metrics.

#### 📑 Operational Invoicing (Lightweight)
- **Generation:** Once a WO is marked "Completed" by the subcontractor.
- **Financial Link:** The invoice amount is auto-synced back to the **BI Ledger** for revenue reporting.
- **Tracking:** Paid vs. Unpaid status management.

---

## 📅 DEVELOPMENT MILESTONES

- [x] **Phase 1:** Update `landing/` HTML/CSS/JS with the Figma-inspired Pricing UI. (READY)
- [x] **Phase 2:** Implement Interactive BI Dashboard (Executive Board). (READY)
- [x] **Phase 3:** Finalize Sales Pivot Analysis (READY)
- [x] **Phase 4:** Develop BI Intelligence Reports (READY)
- [x] **Phase 5:** Finalize Operational Efficiency view (READY)
- [x] **Phase 6:** Develop Financial Intelligence Vault (READY)
- [x] **Phase 7:** Implement Organizational Settings and Global Currency Synchronization. (READY)
- [ ] **Phase 8:** Strategic Work-Order Automation (PO → WO → Invoice Flow). (IN PROGRESS 🚀)
- [ ] **Phase 9:** Synchronize `tms` and `cms` stores (`currency.js`) with the new global pricing keys.
- [ ] **Phase 10:** Develop simplified sub-product pricing sections for CMS and TMS pages.
- [ ] **Phase 11:** Link all sub-pages back to the Main Platform Pricing for Upselling.

---

## 🔗 AUXILIARY DOCUMENTATION REFERENCE
- [Agent Rules File](.agent_rules.md)
- [Master AI Prompt](DIGYNEX_MASTER_PROMPT.md)
- [N8N Automation Guide](N8N_AUTOMATION_GUIDE.md)
- [Fiverr Case Study (TMS)](FIVERR_PORTFOLIO_CASE_STUDY.md)
- [Fiverr Case Study (CMS)](FIVERR_PORTFOLIO_CASE_STUDY_CMS.md)
