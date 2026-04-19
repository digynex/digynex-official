# 🎮 DigyNex Job Finder: UI Interactive Master Catalog (V13.1)
**Doc Ref:** DASHBOARD_ENGINE_INTERACTIVITY_v13.0 (Neural Master Sync)
**Status:** PRODUCTION COMPLETE — V13.1 STABILIZED

This document serves as the single source of truth for every interactive component within the DigyNex universe. It maps every button, card, and trigger to its technical logic and backend Ripple Effect.

---

## 🏗️ 1. Global Core Mechanics

### A. Neural Toggle (Maintenance Mode)
- **UI:** Gold toggle in `AdminHub.vue`.
- **Logic:** Persists `maintenance_mode` setting to `system_config` table.
- **Ripple:** Broadcasts a real-time signal to all active users via Supabase Realtime, immediately locking the UI with a "System Recalibration" overlay.

### B. Strategic Action Hub (`handleDashboardAction`)
- **UI:** Central dispatcher in `App.vue`.
- **Logic:** Every major button (Apply, Tailor, Sync) passes an `actionId` through this controller.
- **Enforcement:** Checks `plan_type` quotas (Weekly/Daily) from the backend `masterConfig` before dispatching signals.
    - <details><summary>Under the Hood</summary>
      - Calls `quotaService.canPerformAction(userProfile, actionId)`.
      - If rejected, triggers a Neural Toast with the specific reason (e.g., "WEEKLY_LIMIT").
      - If accepted, emits n8n signal `DISPATCH_SIGNAL` with job payload.
      </details>

---

## 🏠 2. The Main Dashboard (Discovery Hub)

### A. Matches Hub (Job Cards)
- **Card Click:** Opens `JobDetailOverlay.vue`.
- **Quick Apply Button:** 
    - **Logic:** `handleDashboardAction('quick_apply')`.
    - **Tier Check:** Requires available quota.
    - **Action:** Dispatches job ID to n8n Signal Dispatcher for automation.

### B. Analytics Card (The "Pulse")
- **Skill Gap Radar:** Visual representation of user profile vs. market demand.
- **Recalibrate Button:** 
    - **Logic:** Triggers `ExpertProfileWizard`.
    - **Action:** Resets neural vectors for a fresh profile analysis.

### C. Real-time Notification Bed
- **Bell Icon:** Toggles the "Signal Pulse" popup.
- **Item Click:** Navigation trigger. If it's a job alert, it deep-links directly to the `JobDetailOverlay`.

### D. Global Country Selector (Discovery Slot)
- **UI:** Floating "Flag" icon / Map trigger.
- **Logic:** Filters `filteredMatches` based on target country code (SE, DE, etc.).
- **Marketing Hook:** "World-Class Ingestion" - demonstrates platform's ability to pivot globally without reloading.

### E. Manual Assist Toolkit (Step 6)
- **UI:** Conditional green button in `JobDetailOverlay.vue` if `applyType === 'manual'`.
- **Logic:** `handleDashboardAction('manual_toolkit')`.
- **Ripple:** 
    1. Triggers **Neural Synthesis** (2s delay).
    2. Opens `ManualToolkitOverlay.vue`.
    3. Provides 1-click downloads (CV/Letter) and Professional ID copy.

---

## 🎨 3. CV Studio: Identity Orchestration

### A. Template Gallery Carousel
- **UI:** Snap-scrolling horizontal cards.
- **Button: Maximize:** Opens a high-fidelity zoom view of the specimen.
- **Logic:** Updates reactive `selectedTemplate` id.

### B. Neural Keyword Vault (Stealth Hub)
- **UI:** Dynamic keyword chips.
- **Button: Add Keyword:** 
    - **Tier Gate:** Free users limited to 5 manual keywords.
    - **Action:** Injects ATS Stealth Masking (1px Black-Line) into the PDF structure.

### C. Live HD Viewport (Master Preview)
- **UI:** Auto-scaling A4 preview.
- **Logic:** Real-time HTML→PDF simulation using Gotenberg architecture.
- **Button: Export PDF:** Triggers `pdfService.js`. Checks tier permissions before compilation.
    - <details><summary>Export Flow Specs</summary>
      - Checks `quotaService.canPerformAction('CV_EXPORT')`.
      - Captures `iframe.srcdoc` content.
      - Injects 1px ATS keywords if Tier 2+.
      - Dispatches browser-native print or Gotenberg headless render.
      </details>

### D. Multi-Locale Strategy Switcher
- **UI:** Dropdown for 16 Economic Hubs.
- **Logic:** Re-hydrates `masterProfile.cvLanguage` and triggers `refreshViewport`.
- **Result:** Instant localized branding and terminology without losing profile data.

### E. Broadcast Engine V13.0 (Automated Outreach)
- **UI:** Stealth Proxy section with immersive interactive "Initiate Neural Broadcast" button.
- **Logic:** `handleDashboardAction('initiate_broadcast')`.
- **The "One-Time Campaign Launcher" Architecture (Autopilot Context):**
    - **One-Time Trigger (Campaign Mode):** This button acts as an Autopilot mass-application launcher. Users press this **once** when their CV structure, keywords, and format are thoroughly finalized. Upon initiation, the n8n Automation takes over in the background, continuously running over days/weeks to automatically apply to hundreds of target roles across job portals (e.g., LinkedIn Easy Apply).
    - **Live CV Auto-Sync:** If the user tweaks their CV format or content while a broadcast campaign is already running, they **do not need to press the button again**. The n8n backend is structured to constantly pull the latest active PDF representation directly from the database dynamically before each application transaction.
    - **Differentiation from Targeted Apply:** This button is explicitly designed for mass-automation campaigns. For individual, highly-targeted applications, users utilize the distinct "Apply Now" button designated on each individual Job Card within the Matches Hub.
- **Ripple:** 
    1. Executes a local UI diagnostic sweep (Proxy Layer Handshake simulation).
    2. Serves as the primary frontend junction to trigger the n8n Outbound Automation Webhook payload for global mass CV distribution.

---

## 🛡️ 4. Neural Master Control (Admin Dashboard)

### A. Financial Telemetry Cards
- **Logic:** Visualizes MRR, Active Subscribers, and AI Burn. 
- **Button: Refresh:** Pulls latest metrics from Supabase analytics view.

### B. Strategic Engine Config (V6.5)
- **UI:** Card-based JSON editor for Tier Logic.
- **Logic:** Edit Weekly limits, Daily caps, and Prices per tier.
- **Button: COMMIT CHANGES:** 
    - **Action:** Upserts `tiered_quotas` JSON to `system_config`.
    - **Ripple:** All active users immediately adhere to the new quotas without app restart.

### C. Active Specimen Management (User Table)
- **Button: Tier Override (Sparkles):** Opens mini-popup to promote users to Pro/Elite.
- **Button: Identity Edit:** Manual profile override.
- **Button: Freeze Specimen:** Toggles account suspension.
- **Access Control:** All row actions are locked behind `Tier Alpha (8580)` access. Testers see a `Lock` icon.

### D. Strategic Engine Config (Marketing Dash V7.0)
- **UI:** Interactive Quota Sliders and Price Editors.
- **Logic:** Directly modifies `tiered_quotas` in Supabase.
- **Real-time Broadcaster:** Uses `broadcastChannel` to notify all users to "Recalibrate" their local engines.
- **Hierarchy:** 🛡️ **SUPER-ADMIN ONLY (8580)**.

### E. 👑 Revenue Engine: Founder's Pass
- **UI:** High-contrast Gold/Navy banner in the Identity/Pricing Hub.
- **Logic:** `isFounderPassOpen = true` trigger.
- **Strategic Impact:** Captured in the "Elite Marketing" vision as the ultimate "Lifetime Global Access" hook.

---

## ⚡ 5. Executive CTA Overlays

### A. Founder's Pass Shimmer
- **Button: Establish Neural Link:**
    - **Logic:** Redirects to Stripe Checkout (Owner set one-time link).
    - **Action:** Triggers "Lifetime" plan upgrade.

### B. Tier Upgrade Popups
- **Logic:** Dynamic conversion funnels.
- **Action:** Redirects to Stripe Subscription Portal ($19/$49).

---

---

## 🧙‍♂️ 6. Expert Profile Wizard (The Identity Vault)

### A. 4-Step Master Stepper
- **UI:** Multi-stage questionnaire (Identity → Experience → Skills → Finalize).
- **Auto-Sync LinkedIn:** Dispatches scraper signal to n8n; returns hydrated JSON profile.
- **AI Polish Wand:** Triggers `aiService.js` to refine text into high-impact executive summaries.

---

**Authority:** DigyNex Strategic Oversight | **Prepared By:** Antigravity AI
**Strict Rules:** Verified Modular Separation | **Engine Version:** V13.1 Neural Master Sync
