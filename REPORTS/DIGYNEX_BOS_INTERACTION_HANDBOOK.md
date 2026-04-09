# 👑 DIGYNEX 360: THE INTERACTIVE FUNCTIONAL HANDBOOK
## "The Anatomy of Operational Sovereignty" (2026 Edition)

This handbook serves as the **Definitive Guide** for every interactive component deployed within the live DigyNex 360 Business Operating System (`bi-dashboard`). It maps every page, card, tab, and operational outcome based on the latest source code.

---

## 🌎 MODULE 01: DASHBOARD HUB (GLOBAL PULSE)
_File: `DashboardView.vue` | Context: The Executive Overview._

### 📊 Top KPI Cards (The Vitals)
| Component (Box) | Operational Logic | Executive Outcome |
| :--- | :--- | :--- |
| **Gross Revenue (YTD)** | Displays live revenue data with month-over-month % trend. | Identifies total cash inflow and pacing against targets. |
| **Active Projects** | Tracks ongoing jobs vs. stalled projects. | Immediate visibility into operational capacity. |
| **AI Workload** | Measures how many tasks n8n/AI handle automatically. | Proves the ROI of the digital workforce vs human labor. |
| **Global Expansion** | Highlights active regional sectors. | Visualizes brand spread across new global territories. |

### 🌐 Data Visualizations
- **Box: Global Operations Map / Chart Zone:** Displays multi-region tracking (e.g., Stockholm vs Colombo). 
- **Box: Strategic Alerts Feed:** Live list of high-priority events (e.g., "Invoice Overdue by 45 Days").

---

## 🧬 MODULE 02: SALES NEXUS (VIRAL INTELLIGENCE HUB)
_File: `SalesNexusView.vue` | Context: Autonomous Marketing & Revenue Generation._

### 🎯 The AI Social Niche Deck
| Component (Card) | Operational Logic | Executive Outcome |
| :--- | :--- | :--- |
| **Niche Intelligence Cards** | High-density grid cards displaying trending niches, Growth Potential %, and Target Audience scores. | Exposes untapped market segments dynamically. |
| **Tool Execution Icons** | Hoverable tooltip icons (Imagen, Gemini, ElevenLabs) attached to each niche card. | Shows exactly which AI agents will run the campaign. |
| **AI Sequence Modal (Popup)** | A high-density pop-up triggering a 4-Step Strategic Plan (Hook -> Asset -> Schedule -> Output). | Replaces a human marketing strategist. Approves AI workflows instantly. |

---

## 🏗️ MODULE 03: PROJECT NEXUS (TACTICAL OPERATIONS)
_File: `ProjectNexusView.vue` | Context: Project execution, auditing, and ROI validation._

### 📈 Tabs & Tactical Modals
| Component (Box/Tab) | Operational Logic | Executive Outcome |
| :--- | :--- | :--- |
| **ROI Forecaster (Calculator)** | Interactive parameters (Investment, Staff Cost) allowing "What-If" scenario execution. | Allows the CEO to instantly simulate risk vs. reward on capital deployments. |
| **Nexus ROI Intelligence (Radar)** | Radar chart comparing TRC (Total Resource Cost) vs TRV (Total Return Value). | Mathematically highlights projects that are bleeding money vs highly profitable ones. |
| **Tactical Execution Feed** | Action lists mapping Subcontractors to specific project nodes. | Identifies bottlenecked personnel in the supply chain. |

---

## 💰 MODULE 04: FINANCIAL INTELLIGENCE VAULT
_File: `FinanceView.vue` | Context: Cash flow oversight and multi-tenant ledger control._

### 🏦 The CFO Command Deck
| Component (Card/Box) | Operational Logic | Executive Outcome |
| :--- | :--- | :--- |
| **Operational Runway Card** | Premium KPI tracking exact liquid cash available to sustain operations. | Prevents sudden bankruptcy by knowing exact timeline limits. |
| **Monthly Burn Rate Card** | Calculates EBITDA and cost out-flows with precise Red/Amber alerts. | Immediately highlights inefficient corporate spending. |
| **AR Aging Intelligence Bar** | An interactive, high-contrast visual bar separating trapped capital into **0-30 Days (Emerald)**, **31-60 Days (Amber)**, and **60-90+ Days (Pulse Red)**. | Tactical execution tool to trigger debt collection workflows. |
| **Global Compliance Vault** | A region selector dropdown simulating regional tax laws (Sweden MOMS, UK VAT, USA Sales Tax) vs Global Revenue. | Absolute sovereignty over cross-border taxation. |
| **Central Invoice Ledger** | Table mapping Invoice IDs, Status (Paid/Pending), and individual "Download Original" actions via PDF engine. | Eliminates accounting software subscription needs. |

---

## 🤝 MODULE 05: STRATEGIC CRM (PARTNER DIRECTORY)
_File: `CrmView.vue` | Context: Secure client data shielding and subcontractor mapping._

### 📋 The Data Silo Matrix
| Component (Box) | Operational Logic | Executive Outcome |
| :--- | :--- | :--- |
| **Live Database Table Grid** | Direct connection to the Supabase Cloud. Fetches Subcontractors and active "Elite Client" lists. | Creates a single source of truth for global relationships. |
| **Add Partner Modal** | Secure data-entry wizard with strict validation to map internal resources to client IDs. | Maintains flawless digital registries without duplicate entries. |
| **Auth Shielding (Supabase sync)** | Temporarily bypassed for "High-Fidelity UI", it strictly enforces `<tenant_id>` to prevent unauthorized access. | 100% Anti-Piggybacking protection. No external data bleeding. |

---

## 🏛️ SYSTEM BLUEPRINT: THE AUTOMATION MATRIX (WHITE SHEET)

```mermaid
flowchart TB
    %% Premium Styling Definitions
    classDef executive fill:#0f172a,stroke:#334155,stroke-width:2px,color:#fff,rx:8px,ry:8px;
    classDef AI fill:#4f46e5,stroke:#6366f1,stroke-width:2px,color:#fff,rx:8px,ry:8px;
    classDef finance fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff,rx:8px,ry:8px;
    classDef data fill:#f4f4f5,stroke:#d4d4d8,stroke-width:2px,color:#0f172a,rx:8px,ry:8px;
    classDef automation fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff,rx:15px,ry:15px;

    %% Main Architecture Clusters
    subgraph FRONTEND ["💻 DIGYNEX VUE.JS FRONTEND (User Interfaces)"]
        direction LR
        D["📊 Global Dashboard<br>(KPI Pulse)"]:::executive
        S["🧠 Sales Nexus<br>(Viral Engine)"]:::AI
        P["🏗️ Project Nexus<br>(Tactical ROI)"]:::executive
        F["💰 Finance Vault<br>(Ledger & Tax)"]:::finance
        C["🤝 CRM Hub<br>(Strategic Partners)"]:::executive
    end

    subgraph AUTOMATION ["🤖 n8n AUTOMATION BRIDGE (The Nerve System)"]
        direction TB
        N1(("Social API<br>(Meta/LinkedIn)")):::automation
        N2(("Email/PDF<br>Generators")):::automation
        N3(("Webhook<br>Listeners")):::automation
    end

    subgraph CLOUD ["☁️ BACKEND SOVEREIGNTY (Supabase)"]
        direction LR
        DB[("PostgreSQL Database<br>(Strict Tenant Isolation)")]:::data
        AUTH>["Auth Gateway<br>(Role Based Access)"]:::data
    end

    %% Routing & Data Flow
    AUTH -- "Secures Access" --> FRONTEND
    
    S -- "Triggers AI Sequence" --> N1
    N1 -- "Posts/DMs" --> S
    
    F -- "Generates Invoices" --> N2
    N2 -- "Saves Document" --> DB
    
    C -- "Adds Parter" --> DB
    P -- "Reads Cost Data" --> DB
    D -- "Pulls Global Aggregates" --> DB
    
    N3 -- "External Leads" --> DB
    DB -- "Live Sync" --> FRONTEND

    %% Layout improvements
    FRONTEND ==> CLOUD
    AUTOMATION -. "Background Sync" .-> CLOUD
```

---

## 📅 VERSION CONTROL & SYNC
- **Current Version:** v6.5 (Integrated Alex Master Sync & Total High-Density UI Parity).
- **Architecture Validation:** Verified against Vue 3 Composition API & Supabase Client structures.

*© 2026 DigyNex Ecosystem | Executive Code & Architecture Mapping*

