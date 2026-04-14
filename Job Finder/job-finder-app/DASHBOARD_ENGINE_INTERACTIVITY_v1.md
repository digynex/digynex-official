# DASHBOARD ENGINE INTERACTIVITY (V1.0)
**Project:** DigyNex Job Finder - Commercial SaaS
**Protocol:** Alex Master Sync V6.5 Interaction Matrix

This document maps every interactive **Button** and **Card** within the application to its underlying logic and neural transitions.

---

## 0. SECURITY PROTOCOL: THE NEURAL SHIELD
All high-intent interactions are guarded by the `shieldCheck` engine logic.

| Trigger Action | Unauthenticated State (Guest) | Authenticated State (User) |
| :--- | :--- | :--- |
| **All Primary Buttons** | Shows "Login to..." Toast + Opens Auth Portal | Executes Neural Logic |
| **Data Visibility** | Sample/Fake Data Preview | Persistent Personalized Data |

---

## 1. GLOBAL COMPONENTS

### A. TopNavbar (Identity Header)
| UI Element | Interaction | Neural Logic (Engine) |
| :--- | :--- | :--- |
| **DigyNex Logo** | View | Centered via CSS Grid for absolute symmetry. |
| **Auth Circle (JOIN)** | Click | Sets `authMode = 'register'`. Opens `AuthOverlay`. |
| **Auth Circle (LOGIN)** | Click | Sets `authMode = 'login'`. Opens `AuthOverlay`. |
| **LOG OUT Button** | Click | Triggers `logout()`. Clears session and resets `isAuthenticated`. |
| **Avatar / Name** | View | Display logic splits `fullName` to show **First Name** only. |
| **Language Toggle** | Click | Triggers `toggleSelector('lang')`. Opens dropdown. |
| **Language Option** | Select | Sets `locale`. Calls `profileService.syncProfile()` to persist choice. |

---

## 2. DASHBOARD HUB (JOB HUB)

### A. Welcome Card
| UI Element | Interaction | Neural Logic (Engine) |
| :--- | :--- | :--- |
| **Greeting Text** | View | Displays "Welcome, Expert" (Guest) or "Welcome back, Amila" (Auth). |
| **Recalibrate Button**| Click | Sets `isRecalibrating = true`. Triggers 1.5s simulated neural re-alignment. |

### B. Pipeline Cards (Applied, Interview, etc.)
| UI Element | Interaction | Neural Logic (Engine) |
| :--- | :--- | :--- |
| **Status Card** | Click | Sets `selectedPipelineStep`. Filters job list to that specific status. |
| **Count Indicator** | View | Reactive count of jobs currently in that pipeline phase. |

---

## 3. APPLICATIONS HUB (ACTIVE STREAM)

### A. Filter Button Bar
| UI Element | Interaction | Neural Logic (Engine) |
| :--- | :--- | :--- |
| **ALL / PENDING / ...**| Click | Sets `applicationsFilter`. Triggers multi-status logic in `filteredJobs`. |
| **Active Highlight** | View | Dynamic border + text color change to indicate selection. |

### B. Job Card (Neural Application)
| UI Element | Interaction | Neural Logic (Engine) |
| :--- | :--- | :--- |
| **VIEW DETAILS** | Click | Triggers `openJobDetail(job)`. Opens high-fidelity overlay. |
| **Card Body** | Click | Same as View Details. Sets `selectedJob` and opens modal. |
| **Action Dots (•••)** | Click | Triggers `openActionSheet`. Opens contextual menu. |

### C. Pagination Control
| UI Element | Interaction | Neural Logic (Engine) |
| :--- | :--- | :--- |
| **SHOW MORE** | Click | Triggers `loadMoreApplications()`. Increments `visibleAppsCount` by 4. Shows "Recalibrating..." toast. |

---

## 4. JOB DETAIL OVERLAY (SYNC ENGINE)

### A. Action Hub (Footer)
| UI Element | Interaction | Neural Logic (Engine) |
| :--- | :--- | :--- |
| **APPLY VIA SYNC** | Click | Triggers `handleApply(job)`. |
| | | 1. If not Auth -> Open Login. |
| | | 2. Delay 2.5s (Simulation). |
| | | 3. **RECORD**: Calls `profileService.submitApplication()` (Legal DB sync). |
| | | 4. **UPDATE**: Moves job to 'Applied' status in local state. |
| **Bookmark Icon** | Click | (Planned) Adds job to saved list in database. |
| **Close Icon (X)** | Click | Sets `isJobDetailOpen = false`. Clears `selectedJob`. |

---

## 5. CV STUDIO HUB (MAGIC CENTER)

### A. Template Cards
| UI Element | Interaction | Neural Logic (Engine) |
| :--- | :--- | :--- |
| **Thumbnail** | Click | Sets `selectedTemplate`. Triggers real-time viewport re-render. |
| **Glass-Zoom Icon** | Click | Triggers detailed full-screen preview. |

### B. Brand Buttons
| UI Element | Interaction | Neural Logic (Engine) |
| :--- | :--- | :--- |
| **Color Swatch** | Click | Updates `primaryColor` or `secondaryColor`. Injects into IDR engine. |
| **Sync Now Button** | Click | Persists all branding/keyword state to Supabase. |

---

## 6. NEURAL MASTER CONTROL (ADMIN HUB)

### A. Authentication Gate (Executive Access)
| UI Element | Interaction | Neural Logic (Engine) |
| :--- | :--- | :--- |
| **Neural Pin Input** | Enter Pin | Sets `adminPin`. Enter Key triggers `authenticateAdmin()`. |
| **Establish Link Button** | Click | Calls `authenticateAdmin()`. Validates against `neuralKey`. |
| **Abort Protocol Button** | Click | Emits `setTab('profile')`. Safe exit to Profile Hub. |

### B. Logistics Command Rail (Left)
| UI Element | Interaction | Neural Logic (Engine) |
| :--- | :--- | :--- |
| **Maintenance Toggle** | Click | Emits `update:isMaintenanceMode`. Global app lockdown toggle. |
| **Nuclear Broadcast** | Click | Triggers `handleQuickAction()`. Emits `sendNotification` to all users. |
| **Master DB Purge** | Click | Triggers `handleQuickAction()`. Emits `purgeData` protocol. |
| **Cloud Sync** | Click | Triggers `handleQuickAction()`. Force-syncs Supabase telemetry. |

### C. Surgical Filter Bar
| UI Element | Interaction | Neural Logic (Engine) |
| :--- | :--- | :--- |
| **Plan Selector Tiers** | Click | Sets `selectedTier`. UI scales to 'Elite', 'Pro', or 'Free'. |
| **Date Range Presets** | Click | Sets `selectedRange` (Today, YD, 7D, All). Clears `customDays`. |
| **Manual DAYS Input** | Type | Sets `selectedRange = 'Custom'`. Direct feed into `filteredUsers` date-math logic. |
| **Recalibrate Button** | Click | UI Refresh trigger. Resets horizontal scroll to zero. |

### D. User Specimen Directory
| UI Element | Interaction | Neural Logic (Engine) |
| :--- | :--- | :--- |
| **Search Input** | Type | Reactive filtering via `userSearch` across `name` and `email` nodes. |
| **Sparkle Icon** | Click | Triggers `updateTier(user.id, 'Elite')`. Immediate DB promotion. |
| **Edit Icon (Edit3)** | Click | Opens `SpecimenOverlay`. Dynamic field modification (Planned). |
| **Override Icon (Alert)** | Click | Triggers Suspension/Deletion confirm logic (Planned). |

---

**© 2026 DigyNex Official. Confidential Interaction Registry.**
