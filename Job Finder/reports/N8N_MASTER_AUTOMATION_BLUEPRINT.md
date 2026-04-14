# 🧠 DigyNex Neural Engine: Master N8N Automation Blueprint (2026)

This document is the **Single Source of Truth** for the DigyNex Job Finder automation ecosystem. It bridges the Vue.js frontend with the n8n backend to create an elite, high-trust career acceleration engine.

---

## 🏗️ 1. The Neural Bridge Architecture (Trigger Signals)

The App communicates with n8n via the `user_activity` table in Supabase. Every "Neural Signal" emitted by the UI must be handled by a corresponding n8n Workflow.

| Signal (Action ID) | n8n Workflow Name | Strategic Goal |
| :--- | :--- | :--- |
| `DOC_APPROVAL_PENDING` | **Workflow D: Guardrail** | Mandatory mobile approval (WA/TG) before submission. |
| `LINKEDIN_SYNC_REQUESTED` | **Workflow L: Profiler** | Scrape LinkedIn data and inject into Supabase. |
| `NEURAL_RECALIBRATE` | **Workflow R: Analyst** | AI market trend sync and skill gap suggestions. |
| `ADMIN_BROADCAST` | **Workflow A: Broadcaster** | Global multi-channel executive notification. |
| `ADMIN_DATA_PURGE` | **Workflow P: Purge** | Secure data cleanup and GDPR compliance. |
| `JOB_APPLY` | **Workflow E: Executor** | Headless browser auto-submission (Post-Approval). |

---

## 🛡️ 2. Workflow D: The Verification Guardrail (WhatsApp/Telegram)

**Objective**: Absolute user sovereignty over their specimens. No application is sent without manual mobile verification.

1.  **Trigger**: Supabase Node watches `user_activity` for `DOC_APPROVAL_PENDING`.
2.  **Logic**: 
    - Fetch the user's latest LaTeX CV (from Supabase Storage).
    - Dispatch a rich-media message to **WhatsApp (Twilio)** and **Telegram**.
    - Message includes: "Elite Specimen Generated. Ready for [Job Role] at [Company]. Approve?"
3.  **Buttons**: User receives `[ ✅ Approve ]` and `[ ✏️ Edit ]`.
4.  **Verification**: Upon clicking "Approve", n8n updates `profiles.doc_status` to `Verified`.
5.  **Chain Reaction**: Immediately triggers **Workflow E: The Executor**.

---

## 🤖 3. Workflow E: The Headless Auto-Apply Engine

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

**© 2026 DigyNex Official. Final High-Trust Automation Blueprint. Version 7.0 Stable.**
