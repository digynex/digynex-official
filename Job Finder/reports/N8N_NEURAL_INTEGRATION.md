# 🧠 DigyNex Neural Engine: N8N Integration Architecture

This document outlines the blueprint for Stage 2: Bridging the **Job Finder App** with **n8n.io** to perform real-time CV extraction and transformation into "Elite Specimens."

## 1. The Workflow Overview
The objective is to replace the current simulation logic in `aiService.js` with a live POST request to an n8n webhook.

### 🏛️ n8n Workflow Stages:
1.  **[WEBHOOK]**: receives a POST request containing the raw PDF file/base64.
2.  **[BINARY-TO-TEXT]**: Uses a PDF Parser node to extract the unstructured text.
3.  **[OPENAI CATALYST]**: 
    - **Prompt**: "You are a senior recruiter. Extract professional data from this text and format it into the exact JSON schema provided below."
    - **Task**: Standardize dates (YYYY-MM), clean up skill names, and generate an elite professional bio.
4.  **[RESPONSE]**: Returns the structured JSON payload back to the app.

---

## 2. JSON Schema Requirements
To achieve perfect synchronization with the **Alex Master Sync V6.5** architecture, the n8n response MUST match this structure:

```json
{
  "basic": {
    "fullName": "Name",
    "email": "email@example.com",
    "phone": "+00 000 000 000",
    "location": "City, Country",
    "summary": "Elite professional bio..."
  },
  "experiences": [
    {
      "company": "Company Name",
      "role": "Role Title",
      "start": "2021-01",
      "end": "Present",
      "achievements": "Bullet points of elite wins..."
    }
  ],
  "education": [...],
  "skills": ["JavaScript", "Neural Logic", ...],
  "secretKeywords": ["Cloud Architect", "Strategic Lead", ...]
}
```

---

## 3. App-Side Implementation (aiService.js)
Once the n8n webhook is ready, the `extractDataFromResume` function will be updated to:

```javascript
export const extractDataFromResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch('YOUR_N8N_WEBHOOK_URL', {
    method: 'POST',
    body: formData
  });

  return await response.json();
};
```

---

## 4. Next Steps for Macho (Step-by-Step)
1.  **Step 1**: Create a new workflow in n8n.
2.  **Step 2**: Add a 'Webhook' node (Method: POST).
3.  **Step 3**: Connect a 'Read Binary Files' or dedicated 'PDF Parser' node.
4.  **Step 4**: Inject an 'OpenAI' node with the formatting prompt.
5.  **Step 5**: Provide the Webhook URL back to me to bridge the engine.

🚀 **Status: Ready for Deployment.**

---

## 5. ADMINISTRATIVE AUTOMATION FRAMEWORK (NEURAL COMMAND)

Beyond CV parsing, the **Admin Hub** leverages n8n for global system governance and automated scalability.

### 🏛️ Workflow A: Executive Notification Broadcast
- **Trigger**: App Webhook `POST /webhook/admin-broadcast`
- **Logic**: Admin Hub emits a global message -> n8n iterates through all `public.profiles` -> Sends multi-channel notifications (Email via SendGrid, SMS via Twilio, Push via Firebase).

### 🏛️ Workflow B: Strategic Specimen Engagement (Surgical Filters)
- **Trigger**: Scheduled (CRON) or Manual Filter Export.
- **Logic**: Reads the "Surgical Filtering" criteria (e.g., *Elite Users joined in last 24h*) -> n8n performs an automated "Success Onboarding" sequence -> Updates user tier metadata in Supabase.

### 🏛️ Workflow D: Neural Support & Verification Guardrail (WA/TG)
- **Primary Objective**: Ensure every CV and Cover Letter specimen is approved by the user via mobile (WhatsApp/Telegram) before any automated job application is finalized.
- **Trigger**: App Action `JOB_APPLY_CLICKED` (Emitted by `handleApply`).
- **Surgical Logic**:
    1.  **Status Interception**: n8n checks the `profiles.doc_status` for the specific user.
    2.  **Unverified State**: If state is NOT `Verified`, n8n pauses the application cycle.
    3.  **Cross-Channel Approval**: n8n dispatches a rich-media message (including the LaTeX CV PDF and Cover Letter draft) to the user's WhatsApp and Telegram.
    4.  **Interactive Selection**: User receives two buttons: `[ ✅ Approve & Send ]` and `[ ✏️ Edit in App ]`.
    5.  **Verified State Transformation**: Upon `Approve & Send`, n8n updates `profiles.doc_status` to `Verified` and simultaneously triggers the final `AUTO_APPLY` execution.
    6.  **Confirmation**: n8n dispatches a "Success Hub" message to the user once the application is securely transmitted.

---

## 6. Real-Time Neural Bridge: WhatsApp & Telegram Node Config
To maintain the **DigyNex** premium experience, the following n8n nodes must be configured:
- **WhatsApp (Twilio Node)**: Use the "Media Message" type to send the generated LaTeX specimen.
- **Telegram Node**: Use `sendMessage` with `reply_markup` (Inline Keyboard) for the instant approval loop.
- **Supabase Node**: Update `user_activity` with `DOC_APPROVED` status.

---

**© 2026 DigyNex Official. Confidential Automation Roadmap.**
