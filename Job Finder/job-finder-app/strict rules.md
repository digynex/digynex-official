# PROJECT ARCHITECTURE & OPERATIONAL RULES
**Project Name:** DigyNex AI Job Finder (Commercial SaaS)
**Architecture Style:** Separation of Concerns (SoC) - Modular Design

## 1. THE CORE HIERARCHY
- **Project Manager:** The User (Logic-driven PM).
- **Architect/Developer:** The AI (You).
- **Execution Rule:** ALWAYS read this file before starting any new task or fixing a bug.

## 2. WORK ORDER (MANDATORY)
1. **PHASE 1: THE ENGINE (Logic First)**
   - Update or create logic in the Service Layer (`src/services/`) or Backend Layer (`backend-services/`).
   - Verify data flow, database queries (Supabase), and business logic.
   - DO NOT touch UI files in this phase.
2. **PHASE 2: THE FACE (UI Second)**
   - Only after Phase 1 is verified, update the UI (`.vue` components or `App.vue`).
   - UI components must only call functions from the Service Layer.

## 3. DIRECTORY STANDARDS
- **Frontend Logic:** `src/services/` (e.g., `authService.js`, `profileService.js`).
- **UI Components:** `src/components/` (Modular Vue components).
- **Core Library:** `src/lib/` (e.g., `supabase.js` config).
- **Python/Automation:** `backend-services/` (Isolate from frontend).
- **Clean UI:** Keep `App.vue` clean. Use it for layout and high-level orchestration only.

## 4. SECURITY & CONFIGURATION
- **NO HARDCODING:** Never put API keys or secrets in the code.
- **ENVIRONMENT:** Use `.env` file for all keys. 
- **FRONTEND KEYS:** Prefix with `VITE_` (since we use Vite).
- **GIT SAFETY:** Ensure `.env` is always in `.gitignore`.

## 5. COMMUNICATION PROTOCOL
- **Explain First:** Before writing any code, explain your logic and plan to the Project Manager.
- **Incremental Changes:** Do not rewrite entire files. Only change what is necessary.
- **Error Handling:** Implement try-catch blocks for all async/database calls. Provide clear error logs.

## 6. CODING STYLE
- **Naming:** camelCase for JS, snake_case for Python.
- **Documentation:** Briefly comment on the "WHY" behind complex logic.
- **Vue Standard:** Use Vue 3 `<script setup>` syntax. 
