# 🧠 DigyNex Viral Intelligence Hub (VIH) | Architectural Schema

#CONTEXT:
The VIH is a high-end, AI-driven content architect. It discovers current viral trends and generates fully engineered prompts for image (Midjourney/Kling), video (Runway/Luma), and audio assets.

#SCHEMA:
The system is built on a modular "Insight-to-Asset" pipeline.

## 📁 FOLDER STRUCTURE:
- `/core`: Contains AI logic and prompt templates.
- `/interface`: Vue 3 + Tailwind CSS frontend dashboard.
- `/database`: Transient storage for identified niches and prompts.
- `/docs`: Technical documentation and AI-friendly context anchors.

## 🤖 CORE ENGINE LOGIC (#LOGIC):
1. **discovery.js**: Interfaces with Gemini 1.5 to perform trend extraction.
2. **architect.js**: Transforms an identified niche into 4 consistent stages:
   - Stage 1: The Raw State (Excavation/Before)
   - Stage 2: The Transformation (Active Construction)
   - Stage 3: The Completion (Unfurnished High-End)
   - Stage 4: The Reveal (Cinematic Staging/Visual Climax)
3. **maestro.js**: Generates the "Auditory DNA" (Voice scripts + SFX tags).

// ANCHOR: TREND_FETCH_LOGIC
// Purpose: Fetching 10 high-velocity viral niches for April 2026.
// Logic: Uses temperature control (0.8) to ensure creative variety while maintaining realism.

// ANCHOR: PROMPT_CONSISTENCY_RULE
// Purpose: Ensures "Scene Locking" across all 4 visual stages.
// Method: Injecting a fixed Camera-Metadata block into every generated prompt.

#STATUS: Initializing Phase 1 (Niche Discovery Engine).
