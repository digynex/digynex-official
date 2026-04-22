# 🧠 DigyNex Neural Engine: Master N8N Automation Blueprint (2026) [✅ SYSTEM ACTIVE]

This document is the **Single Source of Truth** for the DigyNex Job Finder automation ecosystem. It bridges the Vue.js frontend with the n8n backend to create an elite, high-trust career acceleration engine.

---

## 🏗️ 1. The Neural Bridge Architecture (Trigger Signals) [✅ COMPLETED]

The App communicates with n8n via the `user_activity` table in Supabase. Every "Neural Signal" emitted by the UI must be handled by a corresponding n8n Workflow.

> **✅ FRONTEND STATUS (2026-04-15):** `profileService.logActivity()` is wired and calls fire on: `CV_EXPORT`, `broadcast`, `recalibrate`, `purge`, and `JOB_APPLY`. The `handleDashboardAction()` dispatcher in `App.vue` is pre-architected for n8n webhook injection at Step 1.

| Signal (Action ID) | n8n Workflow Name | Strategic Goal | Frontend Status |
| :--- | :--- | :--- | :--- |
| `DOC_APPROVAL_PENDING` | **Workflow D: Guardrail** | Mandatory mobile approval (WA) before any apply. | ✅ **COMPLETE** |
| `LINKEDIN_SYNC_REQUESTED` | **Workflow L: Profiler** | Scrape LinkedIn data and update Supabase. | ✅ **COMPLETE** |
| `JOB_SCRAPE_REQUEST` | **Workflow G: Scraper** | Global multi-site discovery (LinkedIn/Indeed/etc). | ⏸️ **PENDING (PHASE 2)** |
| `DOC_EXPORT_REQUEST` | **Workflow E: Executor** | Job Application / CV PDF Export. | ✅ **COMPLETE** |
| `ADMIN_BROADCAST` | **Workflow A: Broadcaster** | Global multi-channel notifications. | ✅ **COMPLETE** |
| `ADMIN_DATA_PURGE` | **Workflow P: Purge** | Secure data cleanup and GDPR compliance. | ⏸️ **PENDING (PHASE 2)** |
| `QUICK_APPLY` | **Workflow E: Executor** | Automated job matching & application. | ✅ **COMPLETE** |
| `CV_EXPORT` | **Workflow X: Logger** | Log export events, enforce quota, trigger Stripe check. | ✅ **COMPLETE** |

### **The "Trust Window" Logic**
- **Verified Status**: Unlocks Workflow E for **30 Days**.
- **Mutation Reset**: Any change to `resume_data` forces status back to `Pending_Approval`.
- **Handshake**: Requires mobile response ("YES") to flip status to `Verified`.

### 🧠 Signal Routing Layer (Switch Mapping) [✅ COMPLETED]
The master switch routes incoming signals based on the `actionId` from the frontend:

- **Output 0: `JOB_APPLY` (Master Executor)**
  - Logic: Standard application dispatch. **Must decrement `cv_limit` on success.**
- **Output 1: `CV_EXPORT` / `CL_EXPORT` (Logger)**
  - Logic: Document generation tracking and immediate quota deduction.
- **Output 2: `ADMIN_BROADCAST` (Global Sync)**
  - Logic: Real-time synchronization of system-wide alerts.
- **Output 3: `DOC_APPROVAL_PENDING` (Verification Handshake)**
  - Logic: Initiates the WhatsApp/Telegram handshake (Workflow D).
- **Output 4: `QUICK_APPLY` (Rapid Executor)**
  - Logic: High-speed matcher dispatch bypassing standard approval.
 ### 🛠️ Step 6: Executor Architecture (Neural Dispatcher)
The Executor handles all application dispatches. It is strictly guarded by the Neural Quota Auditor.

**Logical Flow:**
1.  **Incoming Signal:** (Action `JOB_APPLY` or `QUICK_APPLY`).
2.  **Audit Pulse:** Verifies `cv_limit` and `plan_type`. 
3.  **Path A (Successful):** Dispatch to ATS -> Log `JOB_APPLY` (status: processed) -> `cv_limit--`.
4.  **Path B (Depleted/Strategic):** Log `JOB_QUEUED` (status: pending) -> Strategic Wait for Step 7.

**Strict Rule (Data Purity):** Every activity log MUST pass a pure JSONB object. Never stringify payload blobs, or the system will suffer "String Leakage" corruption ([object Object]).

---

### 🛡️ Guardrail Rules
- **Rule 1:** No application dispatch if `doc_status !== 'Verified'`.
- **Rule 2:** Quota decrement MUST happen only after success logging.
- **Rule 3:** All `JOB_QUEUED` entries must contain the original ATS payload in `details`.

## 🕹️ UI Button & Signal Mapping (Cheat Sheet)
To prevent confusion, here is exactly how the Frontend buttons map to n8n logic:

1. **"Apply Now" (Matches Tab):** ✅
   * *Signal Sent:* `QUICK_APPLY` (Blocked if `doc_status !== 'Verified'`)
   * *Action:* Bypasses standard verification for instant auto-applying.
2. **"Approve & Build Master CV" (Wizard Final Step):** ✅
   * *Signal Sent:* `DOC_APPROVAL_PENDING`.
   * *Action:* The primary entry point for the Neural Bridge. Commits the master identity and triggers the mobile verification handshake.
3. **"Cancel Verification" (Wizard Final Step / Red Button):** ✅
   * *Signal Sent:* None (Local DB Update).
   * *Action:* Resets `doc_status` to `Draft`. Allows the user to exit the pending state and return to editing.
4. **"Manual Assist Toolkit" (Job Detail Overlay):** ✅
   * *Signal Sent:* `MANUAL_ASSIST_START`
   * *Action:* Prepares tailored CV/CL for manual submission on external company portals.

**STATUS:** Neural Bridge Hub is **ACTIVE (Production)**. All signals reaching n8n.

---

## ✅ Workflow D: The Verification Guardrail (WhatsApp) [LIVE]

**Objective**: Absolute user sovereignty. No application is sent without manual mobile verification.

1.  **Trigger**: `DOC_APPROVAL_PENDING` signal.
2.  **Handshake**: Sends WhatsApp message with role/company metadata.
3.  **Verification**: User replies **YES** to flip status to `Verified`.
4.  **Chain Reaction**: Unlocks **Workflow E: The Executor** for a 30-day trust window.

---

## 🤖 3. Workflow E: The Headless Auto-Apply Engine [🎯 ACTIVE GOAL]

**Objective**: Automating the "Soul-Draining" form-filling process.

1.  **Logic**: After Workflow D approval, n8n spins up a **Puppeteer** or **Headless Browser** node.
2.  **Navigation**: Go to the Job Target URL (LinkedIn, Indeed, etc.).
3.  **Mapping**: 
    - Inject `resume_data.basic` into Name/Email fields.
    - Upload the `Verified` PDF specimen from Supabase.
    - Inject the `cover_letter` text into the message box.
4.  **Anti-Bot Pacing**: Implement random delays and human-like interactions.
5.  **Success Pulse**: Once submission is confirmed, log `APPLICATION_SUCCESS` in the activity ledger.

---

## 📄 4. Workflow J: Neural CV Ingestion (PDF-to-JSON)

**Objective**: Transforming raw files into Structured Elite Identities.

*   **Endpoint**: `POST /webhook/neural-extract`
1.  **PDF Parser**: Extract raw text from the uploaded document.
2.  **Gemini 1.5 Pro**: 
    - **Prompt**: "Extract career history, education, and skills. Format into JAAAAS Master JSON Schema. Optimize bio for executive impact."
3.  **Output JSON Schema**:
    ```json
    {
      "basic": { "fullName": "", "email": "", "phone": "", "location": "", "bio": "" },
      "experiences": [ { "company": "", "role": "", "start": "", "end": "", "achievements": "" } ],
      "skills": { "hard": [], "soft": [], "tools": [] }
    }
    ```
4.  **Response**: Inject back into the App state and `profiles` table.

---

## 🌐 5. Workflow L: LinkedIn Neural Scraper

**Objective**: One-click identity construction.

1.  **Trigger**: `LINKEDIN_SYNC_REQUESTED` signal.
2.  **Scraping Logic**: Connect to **LinkedIn RapidAPI** or a custom scraper node.
3.  **Neural Mapping**: Transform scraped metadata into the Master JSON Schema.
4.  **Sync**: Upsert data into Supabase `profiles` and update the `Expert Profile Wizard` in the App.

---

## 📈 6. Workflow R: Neural Recalibration (Market Logic)

**Objective**: Real-time alignment with job market shifts.

1.  **Trigger**: User clicks "Recalibrate Skill Profile".
2.  **Analysis**:
    - Fetch user's `current_skills`.
    - AI researches recent trends for the user's `role` and `location`.
    - Generate a "Skill Gap Report."
3.  **Engagement**: Send the report to the user via WhatsApp with specific learning/keyword suggestions.

---

## ⚖️ 7. Data Purge & Governance (GDPR)

*   **Workflow P**: Triggered daily via CRON.
*   **Logic**: Scan `storage.buckets` for PDF assets older than 14 days.
*   **Action**: Securely delete temporary specimens to ensure asset integrity and privacy compliance.

---

## ⏳ 8. Workflow Q: The Neural Queue & Cron Scheduler (Global Strategic Dispatch V13.5)

**Objective**: Automated processing of "Queued" applications to maximize success within system constraints and recruiter peak hours.

1.  **Trigger**: CRON Trigger (Daily at `00:01`).
2.  **Logic**: Scans `user_activity` for `status: 'pending'` (Queued) applications.
3.  **Prioritization**: Sorts by `match_score` (Top Matches first).
4.  **Strategic Delay**: Waits until **08:00 AM** local time for the target country (determined by metadata).
5.  **Execution**: Sequentially triggers **Workflow E** for each entry until daily/user quota is met.
6.  **Alert**: User receives a mobile notification once the queue starts processing.

---

## 🌎 9. Global Strategic Scraper (Workflow G: DISCOVERY)
**Objective**: Continuous job discovery across multi-site platforms (LinkedIn, Indeed, localized boards) tailored to user geographic preferences.

### **The Multi-Site Pulse**
1.  **Trigger**: CRON Trigger (Every 4-12 hours based on Tier).
2.  **Country Slot Enforcement**:
    -   **Free (T1)**: Scrapes only the primary country slot.
    -   **Pro (T2)**: Parallel scraping for up to 3 countries.
    -   **Elite (T3)**: Full parity across 10+ countries.
3.  **Discovery Protocol**:
    -   Uses Premium Scraping APIs to bypass anti-bot shields.
    -   Filters for "Newest" or "Urgent" keywords.
    -   Extracts Role, Company, Location, and Application URL.
4.  **Neural Matching**:
    -   New discoveries are cross-referenced with user `secretKeywords`.
    -   If match score > 85%, n8n pushes a `TOP_MATCH_DISCOVERED` signal.
5.  **UI Injection**: Jobs appear in the "Matches" hub with a `NEW` badge.

---

**© 2026 DigyNex Official. Final High-Trust Automation Blueprint. Version 10.1 Stable.**
