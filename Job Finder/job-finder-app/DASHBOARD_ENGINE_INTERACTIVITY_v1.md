# DASHBOARD ENGINE INTERACTIVITY (V1.0)
**Project:** DigyNex Job Finder - Commercial SaaS
**Protocol:** Alex Master Sync V6.5 Interaction Matrix

This document maps all interactive elements within the **Dashboard** and **CV Studio** modules to their corresponding logic, service layer calls, and state changes.

---

## 1. GLOBAL NAVIGATION & STATE
| Element | User Action | Engine Response | Service Call |
| :--- | :--- | :--- | :--- |
| **Tab Switcher** | Click 'Dashboard' | Sets `activeTab = 'dashboard'`. UI switches to Job Hub. | N/A |
| **Tab Switcher** | Click 'CV Studio' | Sets `activeTab = 'studio'`. Triggers `refreshViewport()`. | `templateService.getSpecimenHtml()` |
| **Language Select** | Select (EN/DE/SW) | Updates `currentLang` and `i18n.locale`. Sets UI strings. | N/A |
| **Identity Sync** | Click 'Sync' (Top Right) | Triggers `saveProfile()`. Persists colors and keywords. | `profileService.syncProfile()` |

---

## 2. CV STUDIO MODULE (NEURAL CORE)
The CV Studio is the flagship engine for identity synthesis.

### A. Template Gallery (Horizontal Carousel)
- **Select Thumbnail**: Sets `selectedTemplate`. Triggers real-time viewport refresh.
- **Glass-Zoom Icon**: Triggers `selectTemplate(t)`. 
  - *Logic*: Checks `isSuperUser`. If template ID > 4 (Premium) and user is GUEST, triggers **Upgrade Action Sheet**.
  - *Success*: Opens Full-Screen Preview modal.
- **"Use This Template"**: Triggers `finalizeTemplateSelection()`.
  - *Service*: `templateService.setSelectedTemplate()`.

### B. Visual Branding (Theming Engine)
- **Primary/Secondary Colors**: Selecting a color swatch updates `userProfile.primaryColor/secondaryColor`.
- **Auto-Sync**: `watch` effect triggers `refreshViewport()` immediately on color change.

### C. Identity Master Wizard
- **"Build Master Identity" (Blue Glow)**: Opens `ExpertProfileWizard.vue`.
- **Wizard Steps**: 1 (Identity), 2 (Experience), 3 (Skills), 4 (Finalize).
- **"LinkedIn Auto-Sync"**: Fetches public profile data (Mock bridge).
- **"Polish with AI"**: Sends text to AI polishing logic (Mock delay 1.8s).
- **"Commit & Build"**: Triggers `finalizeManualCV()`. Merges wizard state into `masterProfile`.

### D. Surgical Stealth Divider (ATS Optimization)
- **Keyword Tags**: `X` icon calls `removeSecretKeyword(kw)`.
- **Add Keyword**: Input field on `Enter` calls `addSecretKeyword()`.
- **"Analyze System" (Sparkles)**: Triggers `analyzeAndSuggestKeywords()`.
  - *Logic*: Simulates neural analysis of job market trends. Injects 4+ high-value keywords.
- **Stealth Toggle**: Toggles UI visibility of the keywords (remains hidden at 0.1pt in final CV).

---

## 3. DASHBOARD MODULE (JOB HUB)
### A. Pipeline Tracking
- **Application Box**: Click (Applied, Interview, etc.) filters the `allJobs` list.
- **Search Bar**: Real-time filtering on `filteredJobs` and `filteredMatches`.

### B. Job Interactions
- **Card Click**: Opens `JobDetailOverlay.vue`.
- **Action Menu (•••)**: Opens `ActionSheet.vue` for archiving, ignoring, or sharing.

---

## 4. SERVICE LAYER MAPPING
| Function | File | Database Table | Description |
| :--- | :--- | :--- | :--- |
| `syncProfile` | `profileService.js` | `public.profiles` | Full identity state persistence. |
| `getSpecimenHtml` | `templateService.js` | N/A (Server Static) | Injects branding colors into HTML templates. |
| `setSelectedTemplate`| `templateService.js` | `public.profiles` | Persists user template choice. |
| `getUser` / `signIn` | `authService.js` | `auth.users` | Supabase GoTrue authentication. |

---

**© 2026 DigyNex Official. Confidential Document.**
