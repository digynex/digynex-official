# JAAAAS: n8n LinkedIn & LaTeX CV Automation Strategy

This file documents the strategy for connecting the front-end Vue.js UI directly into the `n8n` backend to generate LaTeX-quality CVs dynamically without user input, relying heavily on LinkedIn data injection.

## 1. Trigger Ecosystem

The system listens for specific HTTP calls triggered by the **AI RESUME BUILDER** module in the Expert Profile.

- **Trigger:** Webhook (`POST /webhook/jaaaas-cv-sync`)
- **Payload:** 
  - `user_id`: UUID of the authenticated user
  - `linkedin_url` or `oauth_token`: Extracted from the UI authorization popup
  - `target_language`: Extracted from the UI state (e.g. `de` for German, `sv` for Swedish)

## 2. Core Workflow Logic (n8n Modules)

### Step 1: LinkedIn Scraping & Data Structuring
The workflow triggers the **LinkedIn RapidAPI** or a custom Puppeteer/PhantomJS node inside n8n to extract the user's raw data (Experience, Education, Skills, Summary).
- If manual form data is passed instead, this step formats the JSON.

### Step 2: Gemini 1.5 Pro AI Processing
We pass the extracted JSON to the **Google Gemini Node**.
- **System Prompt:** "You are an Elite Executive CV writer in the requested language. Transform the provided raw data into a strictly structured, ATS-compliant JSON object matching the JAAAAS master schema. Emphasize metrics and remove filler words."
- **Output:** Clean JSON (Work History, Education, High-impact summary).

### Step 3: LaTeX Compilation via Gotenberg
The Clean JSON is passed into an **HTML/LaTeX Template Node**.
- We use predefined elite templates (e.g., "Alex Master Sync V6.0 Minimalist").
- **Intelligence Formatting Rules**:
  - **Block Persistence**: Wrap each role entry in a `minipage` to prevent data being split across pages.
  - **Stealth Keyword Injection**: Injected a 1px "Separator Line" composed of ultra-fine, black-colored keywords to maximize ATS density while maintaining a professional design aesthetic.
- n8n sends a POST request with the rendered template to a **Gotenberg** Docker instance to compile the final high-fidelity PDF.

### Step 4: Storage & UI Response
- The generated PDF is saved to **Supabase Storage** under the user's unique path (`user_id/cv/latest.pdf`).
- n8n returns a `200 OK` Webhook response containing the direct download URL.
- **NEURAL GUARDRAIL**: Upon successful LaTeX compilation, n8n updates the `profiles.doc_status` to `Verified`, signaling the App that the candidate is ready for automated submission.

## 3. Approval Synchronization (Mobile Interception)
As per the updated **Neural Guardrail** rules, the LaTeX compilation is the final stage of the **Workflow D: Approval Cycle**.
1. **Trigger**: User clicking `APPROVE` on WhatsApp/Telegram.
2. **Logic**: n8n proceeds to Step 3 (Gotenberg Compilation).
3. **Persistence**: The verified specimen is locked in Supabase and the Job Application is dispatched.

---

## 4. Privacy & Compliance Layer
- All temporary JSON data generated during the LinkedIn extraction phase is strictly purged at the end of the n8n workflow execution.
- Only the final PDF and the Supabase Storage link are persisted, ensuring alignment with GDPR documentation rules.
