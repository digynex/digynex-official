# CV Template Architecture Blueprint v1.0
**Project**: Global Job Finder Hub (CareerNexus Engine)
**Standard**: Alex Master Sync V6.5 (Surgical Precision)

---

### 🎨 1. Visual Aesthetic & Formatting
- **Format Selection**: 4 Core Premium Styles (Classic, Sidebar, Minimalist, Executive).
- **Profile Image**: Optional "Toggle-ready" image hub in header.
- **Length Constraint**: Hard limit of 1-2 pages maximum.
- **Smart Pagination**: Implementing `break-inside: avoid` to prevent sectional fragmentation across pages. No large top-margins on Page 2.
- **Primary Typography**: **Inter** (Heading / Body).

### 🛡️ 2. Core Stealth Technology (The Black-Line Engine)
This is the core competitive advantage of the CareerNexus engine.

- **Mechanism**: A 1px height divider element (`.stealth-masking-line`) contains a dense string of field-specific keywords.
- **Aesthetic**: Appears to humans as a professional section separator (1px stroke).
- **ATS Capture**: Text within the line uses `0.1pt` font size with matching color, ensuring high-density capture by ATS parsers while remaining invisible to the human eye.
- **Data Integrity**: The `{{stealthKeywords}}` placeholder must be populated with a space-separated string of top-ranking keywords derived from the specific Job Description (JD) analysis.

### 📄 3. Template Master List
| ID | Template Name | Style | Core Focus |
|----|---------------|-------|------------|
| T1 | Classic Elite | Pure Professional | High-density information, clean timeline-inspired layout. |
| T2 | Sidebar Modern | Creative/Tech | Quick scannability, emphasis on technical stack. |
| T3 | Executive One | Corporate | Minimalist, focused on high-impact summaries. |
| T4 | Minimalist Pure | Academic/R&D | Focus on publication and core research experience. |

### 6. Dynamic Scaling & Density Protocol (V1.0)
To ensure the CV fills the A4 page regardless of data volume (Sparse vs. Dense), the following logic is implemented:

### A. Flex-Distribution Logic
- **Parent Container**: `display: flex; flex-direction: column; justify-content: space-between; min-height: 297mm;`
- **Sparse Data**: If a user has only 1 job, the `space-between` logic automatically increases the vertical gap between headers, sections, and the footer, ensuring no "void" at the bottom.
- **Dense Data**: If a user has 10+ bullet points, the container packs the sections tightly (minimum gap) to fit the page.

### B. Conditional Font Scaling (Backend Injection)
The template supports a `{{density}}` class injected into the `<body>` tag:
- `.density-compact`: Reduces `font-size` by 0.5pt and `line-height` to 1.3.
- `.density-spacious`: Increases `font-size` by 1pt and `line-height` to 1.6 (Used for low-data users).

### C. Surgical Compactness Guardrails
- **Minimum Font**: 8.5pt (ATS safety floor).
- **Maximum Font**: 12pt (Professional aesthetics ceiling).
- **Line Break Management**: `break-inside: avoid;` on all `section-block` elements to prevent orphaned headers.

---

### ⚙️ 7. Data Mapping & Injection Protocol
The following fields must be strictly mapped in the n8n/Generation workflow:
*   `name`, `headline`, `bio`, `experience`, `education`, `skills`.
*   `stealthKeywords`: A concatenated string of AI-suggested keywords based on JD + Profile analysis.
*   `currentDate`: Auto-generated generation date.
*   `profileImage`: URL or Base64 of the user's profile picture.
*   `declaration`: The "I hereby declare..." formal statement.

### 🛡️ 8. AI Intelligence & Pre-processing (Smart Fit)
To guarantee a high-impact, 1-page professional CV, the n8n workflow must include a Gemini AI Node:
- **Smart Summarization**: If the input data exceeds one-page capacity, AI automatically prioritizes and summarizes bullet points for impact.
- **Dynamic Keywords**: Role-specific keywords are intelligently updated in the `stealthKeywords` placeholder based on target job analysis.

### 🎨 9. Template Configurability (Theming Engine)
Templates are built using CSS Variables to allow backend-driven styling adjustments:
- `--cv-primary`: Primary branding (Default: #0A2647).
- `--cv-font-size`: Global text baseline (Default: 10.5px).
- `--cv-section-gap`: Vertical spacing adjustment for density control.

### ⚙️ 10. n8n High-Level Workflow
1. **Fetch**: Retrieve User Profile + Target JD.
2. **AI Node**: Pre-process text (Summary/Keywords) + Set Density Class.
3. **Compile**: Inject into Handlebars HTML Template.
4. **Theming**: Override CSS Variables if user-specific branding is applied.
5. **PDF**: Call Gotenberg Chrome-Headless to generate A4 output.

---
**Status**: Architecture v1.2 Locked. Ready for configuring T1 settings.
