# 🤖 DigyNex TMS: n8n Automation Guide

මෙම ගයිඩ් එකේ අරමුණ වෙන්නේ DigyNex TMS එකේ ඉඳන් එන Data (Requests) අරගෙන n8n හරහා WhatsApp යවන, AI වලින් Bill scan කරන, සහ Poster හදන ක්‍රියාවලිය සම්පූර්ණ කරන විදිහ පැහැදිලි කිරීමයි.

**ලොකු වැදගත් දෙයක්:** 
මේ හැමදෙයක්ම එක ලොකු Workflow එකක හදන්න පුළුවන් (Switch node එකක් පාවිච්චි කරලා). හැබැයි කළමනාකරණය (Manage) කරන්න ලේසි වෙන්න සහ Errors අඩුවෙන්න මේවා **වෙනස් Workflows 6ක්** විදිහට හදන එක තමයි ගොඩක්ම හොඳ. (හේතුව: එකක් අවුල් ගියොත් අනිත් ඒවාට බාධාවක් වෙන්නේ නෑ).

පහත දක්වා ඇත්තේ එකිනෙක Workflow එක සඳහා Frontend එකෙන් එන දත්ත (JSON Payloads) සහ ඒ වෙනුවට ඔයා n8n එකේ හදන්න ඕන දේවල් ය.

---

## 1. Attendance Alerts (WhatsApp/SMS)
**අරමුණ:** ලමයා පන්තියට ආවම/ගියහම දෙමාපියන්ට ඒ වෙලාවෙම WhatsApp පණිවිඩයක් යැවීම.
**WebHook URL:** `https://n8n.digynex.se/webhook/attendance-alert` (මෙම නමින් Webhook node එකක් n8n හි හදන්න)

**Frontend එකෙන් එන JSON Payload එක:**
```json
{
  "student_id": "123",
  "student_name": "Kasun Perera",
  "phone": "94770000000",
  "status": "Attended", // or "Absent"
  "class_name": "O/L Science - 2026",
  "date": "2026-03-13",
  "time": "14:30:00",
  "org_id": "org_123"
}
```

**n8n හි කරන්න ඕන ටික:**
1. `Webhook` node එකක් දාන්න (Method: POST).
2. ඒකෙන් එන `phone` සහ `status` අරගෙන `WhatsApp` (හෝ SMS) API අමතන HTTP Request node එකක් දාන්න.
3. අන්තිමට `Respond to Webhook` node එකක් දාලා `{"status": "success"}` යවන්න.

---

## 2. Fee Reminders & Receipts
**අරමුණ:** ළමයින්ට ගෙවීම් මතක් කරන්න (Reminder) සහ සල්ලි ගෙව්වම රිසිට් එක (Receipt) යවන්න.
**WebHook URL:** `https://n8n.digynex.se/webhook/fee-action`

**Frontend එකෙන් එන JSON Payload එක:**
```json
{
  "type": "receipt", // or "reminder"
  "student_name": "Kasun Perera",
  "phone": "94770000000",
  "amount": 2500,
  "month": "March 2026",
  "date": "2026-03-13",
  "org_id": "org_123"
}
```

**n8n හි කරන්න ඕන ටික:**
1. `Webhook` node (Method: POST).
2. `Switch` node එකක් දාලා `type` එක `receipt` ද `reminder` ද කියලා වෙන් කරන්න.
3. ඒ අනුව අදාළ WhatsApp message එක යවන්න.
4. `Respond to Webhook` node එකක් දාලා ඉවර කරන්න.

---

## 3. Gemini AI Expense Scanner (පට්ටම එක! 🚀)
**අරමුණ:** බිල් එකක පින්තූරයක් (Image) Upload කළාම AI එකෙන් ඒක කියවලා Date, Category, Amount සහ Description එක විතරක් ගන්න එක.
**WebHook URL:** `https://n8n.digynex.se/webhook/scan-expense`

**Frontend එකෙන් එන Payload එක:**
මේක එන්නේ JSON විදිහට නෙමෙයි `multipart/form-data` විදිහට (Image file එකක්).

**n8n හි කරන්න ඕන ටික:**
1. `Webhook` node (Method: POST).
2. `Google Gemini` / `OpenAI` vision model එක පාවිච්චි කරන ආකෘතියක් දාන්න.
3. ෆොටෝ එකේ තියෙන බිලෙන් මේ දත්ත 4 ඉල්ලන Prompt එකක් දෙන්න: `date`, `category`, `amount`, `description`.
4. `Respond to Webhook` node එකේ Body එකට අර AI එකෙන් හොයාගත්ත JSON ටික දාන්න (එතකොට Frontend එකේ Auto fill වෙනවා).

---

## 4. Star Poster Generator
**අරමුණ:** මාසෙ සුපිරිම ළමයට (Star of the month) Social media දාන්න පුළුවන් පෝස්ටරයක් Auto හදන්න.
**WebHook URL:** `https://n8n.digynex.se/webhook/generate-poster`

**Frontend එකෙන් එන JSON Payload එක:**
```json
{
  "student_name": "Nimal Silva",
  "class_name": "A/L Physics",
  "photo_url": "https://example.com/photo.jpg",
  "achievement": "Highest Marks for March"
}
```

**n8n හි කරන්න ඕන ටික:**
1. `Webhook` node (Method: POST).
2. BannerBear හෝ Placid වගේ Image Generation node එකක් සම්බන්ධ කරලා අර විස්තර ටික යවන්න.
3. හදන පෝස්ටරය නියමිත Telegram ගෲප් එකකට හෝ අදාළ තැනට යැවීම.
4. `Respond to Webhook` දාන්න.

---

## 5. Parent Feedback Router
**අරමුණ:** දෙමව්පියෝ දාන අදහස් (Feedback) Administration ටීම් එකට දැනුම් දෙන්න.
**WebHook URL:** `https://n8n.digynex.se/webhook/parent-feedback`

**Frontend එකෙන් එන JSON Payload එක:**
```json
{
  "student_id": "123",
  "message": "My son is struggling with science class.",
  "timestamp": "2026-03-13T14:30:00.000Z"
}
```

**n8n හි කරන්න ඕන ටික:**
1. `Webhook` node (Method: POST).
2. අදාල Student ගේ තොරතුරු Supabase එකෙන් හොයාගන්න node එකක්.
3. අදහස් කරන විදිහට (උදා: Slack එකට හෝ WhatsApp Admin ගෲප් එකට) Message එකක් යවන්න.
4. `Respond to Webhook` දාන්න.

---

## 6. Payout Invoice
**අරමුණ:** ටියුටර්ස්ලගේ (Teachers) සල්ලි ගෙව්වාම එයාලට Invoice එකක් යැවීම.
**WebHook URL:** `https://n8n.digynex.se/webhook/payout-invoice`

**Frontend එකෙන් එන JSON Payload එක:**
```json
{
  "type": "PAYOUT_INVOICE",
  "tutor_name": "Mr. Namal Fernando",
  "tutor_email": "namal@example.com",
  "amount": 45000,
  "period": "March 2026",
  "org_id": "org_123"
}
```

**n8n හි කරන්න ඕන ටික:**
1. `Webhook` node (Method: POST).
2. PDF සැකසීමේ Tool එකක් හෝ Email Send node එකක් භාවිතා කරලා, අදාල විස්තර එක්ක Email එක යැවීම.
3. `Respond to Webhook` දාන්න.

---
**සුභ පැතුම්!** දැන් ඉදිරියට Frontend සහ Backend දෙකම එකපාර නියමෙට වැඩ කරනවා ඇති. ඕනෑම අවස්ථාවක අලුත් දෙයක් එකතු කරන්න ඔනේ නම් මේ Document එක අනුගමනය කරන්න. 🚀
