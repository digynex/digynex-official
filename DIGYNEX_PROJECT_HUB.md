# 👑 DIGYNEX PROJECT HUB: Unified SaaS Roadmap

This document serves as the **Single Source of Truth** for the DigyNex Ecosystem. All architectural decisions, pricing models, and development milestones are documented here.

---

## 💰 UNIFIED PRICING STRATEGY (GLOBAL SaaS)

The pricing is designed as a **Hybrid Model**: Full-Suite Platform Pricing vs. Individual Sub-Product Entry Plans.

### 1. Main Platform Pricing (digynex.se/pricing)
*Targeting: Medium-Large Enterprises & Full Business Management*

| Tier | Price (Monthly) | Setup Fee | Active Profiles | Key Value |
| :--- | :--- | :--- | :--- | :--- |
| **STARTER** | **$29** | **$99** | Up to 100 | Basic dashboards & core records. |
| **GROWTH** ⭐ | **$79** | **$199** | Up to 500 | **Nexus AI Business Agent** & full automation. |
| **SCALE** | **$149** | **$499** | Up to 2,000 | **Custom-Trained AI Agent** & multi-org ops. |
| **ENTERPRISE** | **Custom** | **$999+** | Unlimited | Dedicated API & specialized custom models. |

---

### 2. Sub-Product (Micro-SaaS) Entry Pricing
*Targeting: Small businesses needing specific tools (CMS, TMS, FB Automation)*

#### 📦 DigyNex CMS (cms.digynex.se)
- **CMS Entry:** **$19** (Setup: $49)
- **CMS Pro:** **$39** (Setup: $99)
- *Upsell CTA: "Upgrade to Full Suite ($79)"*

#### 📦 DigyNex TMS (tms.digynex.se)
- **TMS Entry:** **$29** (Setup: $69)
- **TMS Pro:** **$49** (Setup: $129)
- *Upsell CTA: "Upgrade to Full Suite ($79)"*

---

### 3. Market Detection & Currency Logic
- **SE (Sweden):** 
  - Monthly: 299 kr / 799 kr / 1499 kr
  - Setup: 999 kr / 1,999 kr / 4,999 kr
- **LK (Sri Lanka):** 
  - Monthly: 2,500 / 12,000 / 18,000 LKR
  - Setup: 12,000 / 18,000 / 30,000 LKR
- **GLOBAL:** 
  - Monthly: $29 / $79 / $149
  - Setup: $99 / $199 / $499

---

## 🎨 VISUAL IMPLEMENTATION PLAN (PREMIUM UI/UX)

Following the Figma Blueprint, we will implement a world-class pricing page on `digynex.se`:

### 1. Hero & Billing Toggle
- **Smooth Toggle:** Monthly vs. Yearly switch (Yearly saves 20%).
- **Clean Headline:** "Simple Pricing. Decision Intelligence."

### 2. The Pricing Grid (Glassmorphism Tier)
- **Design Style:** Translucent dark backgrounds with subtle borders.
- **Micro-Animations:** On hover, cards lift and shadows deepen.
- **Growth Card Glow:** A subtle, pulsating gradient border (Blue-Purple) to drive conversion.
- **Badging:** "Most Popular" for the Growth tier.

### 3. Progressive Disclosure
- **Tooltips:** Information icons for "Active Profiles" explaining the metric simply.
- **Comparison Table:** A minimalist table below the cards for detailed feature comparison.
- **FAQ Section:** Accordion-style section for common queries (Profiles, Upgrades, Trial).

---

## 📅 DEVELOPMENT MILESTONES

- [ ] **Phase 1:** Update `landing/` HTML/CSS/JS with the Figma-inspired Pricing UI. (READY)
- [ ] **Phase 2:** Synchronize `tms` and `cms` stores (`currency.js`) with the new keys.
- [ ] **Phase 3:** Develop simplified sub-product pricing sections for CMS and TMS pages.
- [ ] **Phase 4:** Link all sub-pages back to the Main Platform Pricing for Upselling.

---

## 🔗 AUXILIARY DOCUMENTATION REFERENCE
- [Agent Rules File](.agent_rules.md)
- [Master AI Prompt](DIGYNEX_MASTER_PROMPT.md)
- [N8N Automation Guide](N8N_AUTOMATION_GUIDE.md)
- [Fiverr Case Study (TMS)](FIVERR_PORTFOLIO_CASE_STUDY.md)
- [Fiverr Case Study (CMS)](FIVERR_PORTFOLIO_CASE_STUDY_CMS.md)
