# 🏗️ DigyNex n8n: Master Workflow Library (V13.3 - Bulletproof)
**Doc Ref:** N8N_MASTER_WORKFLOW_LIBRARY.md
**Logic:** Explicit Node Referencing (Ensures data is always fetched from the root Webhook)

---

## 🛠️ Step 1: The Neural Switch
Routes root signals. No changes needed here.

---

## 🚀 Step 2: Executor Pipeline (JOB_APPLY)
Uses explicit referencing for ATS submission.

```json
{
  "nodes": [
    {
      "parameters": {
        "method": "POST",
        "url": "https://httpbin.org/post",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            { "name": "applicant_email", "value": "={{ $node[\"UI Signal Webhook\"].json.body.user_id }}" },
            { "name": "job_role", "value": "={{ $node[\"UI Signal Webhook\"].json.body.details.role }}" },
            { "name": "company", "value": "={{ $node[\"UI Signal Webhook\"].json.body.details.company }}" }
          ]
        }
      },
      "name": "Send Application to ATS",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [1100, -100]
    }
  ]
}
```

---

## 🛰️ Step 3: Guardrail Engine (Telegram Approval)
Uses explicit referencing for messaging.

```json
{
  "nodes": [
    {
      "parameters": {
        "chatId": "YOUR_CHAT_ID",
        "text": "=🚀 **DigyNex AI: Approval Required**\n\nHello! Our AI is ready to submit your application for:\n\n📍 **Role:** {{ $node[\"UI Signal Webhook\"].json.body.details.role }}\n🏢 **Company:** {{ $node[\"UI Signal Webhook\"].json.body.details.company }}\n\nPlease review your documents. If everything looks good, reply **YES** to this message to initiate the expert submission.",
        "additionalFields": { "parse_mode": "Markdown" }
      },
      "name": "Telegram: Guardrail Approval",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1,
      "position": [1100, 400]
    }
  ]
}
```

---

## 📊 Step 4: Quota Logger (CV_EXPORT)
Uses explicit referencing for identification and decrementing.

```json
{
  "nodes": [
    {
      "parameters": {
        "operation": "getMany",
        "table": "profiles",
        "filters": {
          "conditions": [
            {
              "key": "email",
              "value": "={{ $node[\"UI Signal Webhook\"].json.body.user_id }}"
            }
          ]
        }
      },
      "name": "Supabase: Fetch Current Quota",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [1100, 150]
    },
    {
      "parameters": {
        "operation": "update",
        "table": "profiles",
        "id": "={{ $node[\"Supabase: Fetch Current Quota\"].json.id }}",
        "data": {
          "cv_limit": "={{ $node[\"Supabase: Fetch Current Quota\"].json.cv_limit - 1 }}"
        }
      },
      "name": "Supabase: Decrement Quota",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [1300, 150]
    }
  ]
}
```

---

## 📢 Step 5: Broadcast Engine (ADMIN_BROADCAST)
Synchronizes global alerts across the frontend and notifies the team.

```json
{
  "nodes": [
    {
      "parameters": {
        "operation": "update",
        "table": "system_config",
        "selectType": "buildManually",
        "mustMatch": "anySelectCondition",
        "selectConditions": {
          "conditions": [
            {
              "key": "key",
              "value": "global_broadcast"
            }
          ]
        },
        "data": {
          "value": "={{ $node[\"UI Signal Webhook\"].json.body.details }}"
        }
      },
      "name": "Supabase: Sync Global Broadcast",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [1100, 600]
    },
    {
      "parameters": {
        "chatId": "YOUR_ADMIN_CHAT_ID",
        "text": "=📢 **DIGYNEX GLOBAL BROADCAST**\n\n**Status:** {{ $node[\"UI Signal Webhook\"].json.body.details.active ? '🔴 ACTIVE' : '⚪ INACTIVE' }}\n**Type:** {{ $node[\"UI Signal Webhook\"].json.body.details.type.toUpperCase() }}\n\n**Message:**\n{{ $node[\"UI Signal Webhook\"].json.body.details.message }}\n\n*Strategic Pulse: Neural Master Hub*",
        "additionalFields": {
          "parse_mode": "Markdown"
        }
      },
      "name": "Telegram: Broadcast Log",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1,
      "position": [1300, 600]
    }
  ]
}
```

---

## ⚡ Step 6: Executor Pipeline (QUICK_APPLY / JOB_APPLY)
**Strict Rule:** Never use `JSON.stringify` on the payload. Pass the JavaScript object directly to the Supabase node to ensure proper JSONB storage and prevent `[object Object]` data corruption.

### 🛠️ Headless Execution Script (Puppeteer Node)
*This script performs the actual form-filling on external websites.*
```javascript
const { url, userData } = items[0].json;
const puppeteer = require('puppeteer');
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Fill common fields using Smart Selectors
    const mapping = {
        'input[name*="name"]': userData.fullName,
        'input[name*="email"]': userData.email,
        'textarea[name*="cover"]': userData.coverLetter
    };

    for (const [sel, val] of Object.entries(mapping)) {
        if (await page.$(sel)) await page.type(sel, val, { delay: 100 });
    }

    // Handle CV Upload (Verified PDF)
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) await fileInput.uploadFile('/tmp/verified_cv.pdf');

    await page.waitForTimeout(1000);
    const submit = await page.$('button[type="submit"]');
    if (submit) await submit.click();

    await browser.close();
    return [{ json: { status: 'success' } }];
} catch (e) {
    await browser.close();
    throw e;
}
```

**Logic Engine (Neural Quota Auditor V13.8):**
```javascript
const profile = $json; 
const now = new Date();
const planType = (profile.plan_type || 'free').toLowerCase();
const role = (profile.role || 'user').toLowerCase();

let plan = (planType === 'pro' || planType === 'growth') ? 1 : 0;
if (planType === 'elite' || role === 'super_admin') plan = 2;

const balance = profile.cv_limit || 0;

// ELITE/ADMIN: Instant Dispatch (Step 2)
if (plan >= 2) return { status: 'DISPATCH_INSTANT', ui_type: 'success', next_available: 'Available Now' };

// FREE/PRO: Check Balance
if (balance <= 0) {
    let nextDate = new Date();
    if (plan === 0) { // Free: Next Monday Reset
        const day = now.getDay();
        const diff = (day === 0 ? 1 : 8 - day);
        nextDate.setDate(now.getDate() + diff);
        nextDate.setHours(0, 1, 0, 0); 
    } else { // Pro/Growth: Tomorrow 06:00 AM Strategic Window
        nextDate.setDate(now.getDate() + 1);
        nextDate.setHours(6, 0, 0, 0);
    }
    return { status: 'QUEUE_STRATEGIC', ui_type: 'info', next_available: nextDate.toLocaleString('en-GB') };
}

return { status: 'DISPATCH_INSTANT', ui_type: 'success', next_available: 'Available Now' };
```

---

## 🕒 Step 7: DigyNex Neural Cron: Global Strategic Dispatcher (V13.5 - Bulletproof)
The "Invisible Force" that handles queued applications during optimal recruiter peak hours.

**Operational Sequence:**
1.  **Cron Trigger (00:01 AM):** Daily wake-up call to scan for pending tasks.
2.  **High-Performance Buffer Fetch:** Uses `pending_strategic_queue` View.
3.  **Neural Prioritization (Top Matches First):** 
    - Sorts the queue by **`match_score` DESC**.
    - This ensures the jobs that fit the user best are applied for first within their daily limit.
4.  **Manual-to-Queue Intercept:** 
    - If a user manually clicked apply but was over-limit, the frontend sent it here with `status: 'pending'`. 
    - These are processed alongside automated matches.
5.  **Strategic Delay:** 
    - AI determines the target country's timezone.
    - Waits until **08:00 AM** local time before starting the submission.
6.  **Action:** Sequentially triggers **Step 6 (Headless Executor)**.
7.  **Finalization:** 
    - Updates `user_activity` status to `processed`.
    - Decrements `cv_limit` in the `profiles` table.
    - Sends WhatsApp: "Elite Pulse: Your top matches have been dispatched! 🚀"

---

## ⚡ Step 8: Global Verification Handshake (Workflow D: GUARDRAIL)
This is the "Neural Gateway" that prevents unauthorized job applications.

### **The Mobile Protocol (WhatsApp Handshake)**
1.  **Incoming Pulse**: Detects `DOC_APPROVAL_PENDING`.
2.  **Payload Security**: Must extract `user_phone`, `role`, and `company` from the `details` object.
3.  **The Message Window**:
    -   If 24h window is open: Send **Free Text** message.
    -   If 24h window is closed: Call **WhatsApp Template** (`cv_approval_request`).
4.  **The Intercept**:
    -   n8n waits for **User Reply (Wait Node)**.
    -   If reply contains **"YES"** (Case Insensitive): 
        -   **DB UPDATE**: `profiles.doc_status = 'Verified'`.
        -   **UI SYNC**: Sends a confirmation message: "Identity Verified 🛡️. Global Submission Unlocked."
    -   If reply contains **"NO"**: 
        -   **DB UPDATE**: `profiles.doc_status = 'Draft'`.

---

## 🕵️ Step 9: Workflow G (Global Job Scraper)
*Hybrid Minimum-Cost Architecture using Adzuna & Careerjet.*

**Sequence of Actions:**
1.  **Step 1: Check Supabase (Cache System):** The workflow pulls a target request (Keywords + Country) and queries the internal `job_scrapes` table via the Supabase Node.
2.  **Step 2: If Exists (Cache Hit):** If valid data is found (less than 24 hours old), the HTTP fetch is bypassed, and the cached jobs are forwarded instantly to the Vue Frontend. *(Result: $0 API Cost)*.
3.  **Step 3: If Not Exists (The Fetch):** If no fresh cache exists, an HTTP Request Node makes an external call to the Free API Tier (Adzuna / Careerjet).
4.  **Step 4: Save & Format:** The fresh payload is immediately saved into `job_scrapes` to populate the cache, then formatted into a strict JSON object that feeds the frontend's "4-by-4" Lazy Loading state.

**Strict Rule (Data Purity):** Every chunk saved to `job_scrapes` MUST be sent as a pure array of objects directly assigned to the `jobs` parameter. The target Supabase column is strictly `JSONB`.

---

## 🔱 Summary of Global Integration
- **Root Webhook**: Must always use `{{ $node["UI Signal Webhook"].json.body }}`.
- **Signal Integrity**: All signal data flows into Section 7 (The Dispatcher) for final queuing.
- **Production URL**: `https://n8n.digynex.se/webhook/neural-bridge`

---
