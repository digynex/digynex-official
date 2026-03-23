# 🚀 DigyNex TMS - n8n Final Configuration Reference
මේක තමයි අපි හරියටම ටෙස්ට් කරලා, 100% ක් වැඩ කරනවා කියලා තහවුරු කරගත්ත Workflows 3ට අදාල අවසාන Values ටික. මේක කොපි එකක් විදිහට තියාගන්න. අනාගතේ මොනවා හරි අවුලක් ගියොත් මේක බලලා හදාගන්න පුළුවන්.

---

## 1. Attendance Alerts (පැමිණීමේ දැනුම්දීම්)
මෙම Workflow එක මගින් ළමයෙක් පන්තියට පැමිණි විට සෘජුවම WhatsApp හරහා දෙමව්පියන්ට දැනුම්දීමක් යවයි.

### Node 1: Webhook
- **HTTP Method:** `POST`
- **Path:** `attendance-alert`
- **Respond:** `Using 'Respond to Webhook' Node`

### Node 2: WhatsApp (Send Message)
- **Recipient's Phone Number:**
  - අනිවාර්යයෙන්ම Expression (`fx`) ලෙස තිබිය යුතුය.
  - Value: `{{ $json.body.phone }}`
- **Message:** (උදාහරණයක්)
  ```text
  DigyNex TMS 🔔
  ආයුබෝවන්, {{ $json.body.student_name }} අද ({{ $json.body.date }}) දින {{ $json.body.time }} ට පන්තියට පැමිණියා.
  Status: {{ $json.body.status }}
  ```

### Node 3: Respond to Webhook
- **Respond With:** `JSON`
- **Response Body:**
  ```json
  {
    "status": "success",
    "message": "Attendance alert sent successfully"
  }
  ```

---

## 2. Fee Reminders & Receipts (බිල්පත් සහ මතක් කිරීම්)
මෙහිදී Frontend එකෙන් එවන `type` එක (receipt ද reminder ද) අනුව Switch එක හරහා ගොස් අදාල මැසේජ් එක යවයි.

### Node 1: Webhook
- **HTTP Method:** `POST`
- **Path:** `fee-action`
- **Respond:** `Using 'Respond to Webhook' Node`

### Node 2: Switch (Routing Logic)
- **Mode:** `Rules`
- **Rule 1 (Receipts):**
  - Value 1 (`fx` ලෙස): `{{ $json.body.type }}`
  - Operator: `is equal to`
  - Value 2 (`String` ලෙස): `receipt` 
- **Rule 2 (Reminders):**
  - Value 1 (`fx` ලෙස): `{{ $json.body.type }}`
  - Operator: `is equal to`
  - Value 2 (`String` ලෙස): `reminder`

### Node 3: WhatsApp (Send receipt / Send reminder)
- **Phone Number (`fx`):** `{{ $json.body.phone }}`

### Node 4: Respond to Webhook (Route දෙකටම වෙන වෙනම දාන්න)
- **Respond With:** `JSON`
- **Response Body:** `{"status": "success"}`

---

## 3. Gemini AI Expense Scanner (බිල්පත් ස්කෑන් කිරීම)
මෙය Image file එකක් Webhook හරහා ලබාගෙන Google Gemini Flash එකෙන් කියවා JSON එකක් ලෙස ආපහු Frontend එකට ලබා දෙයි.

### Node 1: Webhook
- **HTTP Method:** `POST`
- **Path:** `scan-expense`
- **Respond:** `Using 'Respond to Webhook' Node`
- **Options -> Add Option:** 
  - `Binary Data` (හෝ Include Binary Data) = `true` (On කරන්න)
  - `Field Name for Binary Data` = **`file`**

### Node 2: Google Gemini (Analyze an Image)
- **Resource:** `Image`
- **Operation:** `Analyze Image`
- **Model:** `models/gemini-2.5-flash`
- **Text Input:**
  ```text
  You are an expert expense scanner for DigyNex. Analyze the attached receipt/bill image. 
  Extract the information and return ONLY a valid JSON object with the following exact keys:
  - "date": Date of the receipt in YYYY-MM-DD format.
  - "category": Choose one from (Food, Transport, Utilities, Office Supplies, Maintenance, Salary, Other).
  - "amount": Only the numerical value (e.g., 2500).
  - "description": A short, 3-4 word summary.

  IMPORTANT: Return ONLY the raw JSON string. Do NOT use markdown code blocks (like ```json), no backticks, and no extra text.
  ```
- **Input Type:** `Binary File(s)`
- **Input Data Field Name(s):** **`file0`** *(n8n එකෙන් පළමු ෆොටෝවට ලබා දෙන නම මෙයයි)*

### Node 3: Respond to Webhook
- **Respond With:** `JSON`
- **Response Body (`fx`):**
  ```javascript
  {{ JSON.parse($json.content.parts[0].text) }}
  ```


---

## 4. Star Poster Generator (WhatsApp/Telegram Auto Poster)
මෙය කිසිදු Paid API එකක් (Bannerbear වැනි) භාවිතා නොකර n8n හි ඇති 'Edit Image' node හරහා නොමිලේම පෝස්ටරයක් සාදා Gemini මගින් Caption එකක් ලියා එය Telegram/WhatsApp වෙත යවයි.

### Node 1: Webhook
- **HTTP Method:** `POST`
- **Path:** `generate-poster`
- **Respond:** `Using 'Respond to Webhook' Node`

### Node 2: HTTP Request (පසුබිම් පින්තූරය ලබා ගැනීම)
- **Method:** `GET`
- **URL:** `https://images.unsplash.com/photo-1557683316-973673baf926?w=1000` (හෝ ඔබට අවශ්‍ය පසුබිම් රූපයේ ලින්ක් එක)
- **Response Format:** `File`
- **Put Output in Field:** `data`

### Node 3: Edit Image (නම ලිවීම)
- **Operation:** `Add Text`
- **Property Name:** `data`
- **Text:** `{{ $("Webhook").item.json.body.student_name }}`
- **Font Size:** `80`
- **Font Color:** `#FFFFFF`
- **Position X:** `100` | **Position Y:** `400`

### Node 4: Edit Image 2 (Achievement සහ පන්තිය ලිවීම)
- *කලින් Node එකම copy/paste කරන්න.*
- **Operation:** `Add Text`
- **Property Name:** `data`
- **Text:** `{{ $("Webhook").item.json.body.achievement }}\n{{ $("Webhook").item.json.body.class_name }}`
- **Font Size:** `40`
- **Font Color:** `#FFFFFF`
- **Position X:** `100` | **Position Y:** `500`

### Node 5: Google Gemini (Caption ලිවීම)
- **Resource:** `Text` | **Operation:** `Message a Model`
- **Model:** `models/gemini-2.5-flash`
- **Prompt:**
  ```text
  Write a highly engaging, short, and professional Facebook post caption (in Sinhala and English mixed - Singlish/Sinhala) to congratulate our Star Student.
  Student Name: {{ $("Webhook").item.json.body.student_name }}
  Class: {{ $("Webhook").item.json.body.class_name }}
  Achievement: {{ $("Webhook").item.json.body.achievement }}
  Tone: Enthusiastic, motivating, and proud. Include relevant emojis. Focus on the hard work of the student at DigyNex. Do not include hashtags.
  ```
- **Simplify Output:** `ON`

### Node 6: Merge (රූපය සහ Caption එකතු කිරීම)
- *මෙම node එකට Edit Image 2 (Input 1) සහ Google Gemini (Input 2) යන දෙකෙන්ම connection ලබා දෙන්න.*
- **Mode:** `Combine`
- **Combine By:** `Position` (හෝ Multiplex)

### Node 7: Telegram (පෝස්ටරය යැවීම)
- **Resource:** `Message` | **Operation:** `Send Photo`
- **Chat ID:** ගෲප් එකේ හෝ චැනල් එකේ ID එක (උදා: `7467791306`)
- **Binary File:** `ON`
- **Input Binary Field:** `data`
- **Reply Markup:** `None`
- **Caption:** `{{ $json.content.parts[0].text }}` *(Merge node එකෙන් එන Gemini text එක)*

### Node 8: Respond to Webhook
- **Respond With:** `JSON`
- **Response Body:** `{"status": "success", "message": "Poster generated and sent to Admin Team"}`
