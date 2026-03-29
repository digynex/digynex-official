/**
 * 🚀 DigyNex Viral Intelligence Hub (VIH) | Core Logic: Discovery Engine
 * 
 * #CONTEXT: 
 * Responsible for interfacing with Gemini 1.5 to perform predictive analysis 
 * of "High Velocity" viral niches for 2026.
 * 
 * #LOGIC:
 * 1. Trend analysis (Global content clusters)
 * 2. Suggestion synthesis (10 Viral Niches)
 * 3. Consistent Prompt Expansion (Stages 1-4)
 * 
 * // ANCHOR: TREND_SYSTEM_PROMPT
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Class representing the Viral Content Architect.
 * Focuses on identifying upcoming high-growth trends before they peak.
 */
class ViralDiscoveryEngine {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  /**
   * Fetches the top 10 viral niches for current market state.
   * @returns {Promise<Array>} List of viral niches with descriptions and potential.
   */
  async getViralNiches() {
    const prompt = `
      Act as a Global AI Viral Content Strategist for DigyNex. 
      Identify 10 "High-Growth, Low-Saturation" viral video niches for April 2026. 
      Focus on satisfactory visual transformations, specialized builds, or aesthetic "restoration" niches.
      
      For each niche, provide:
      1. Niche Title (Aesthetic/Catchy)
      2. Viral Growth Potential (Why it will peak now)
      3. A 4-stage Visual Sequence (Beginning to Climax)
      
      Format strictly as a JSON array of objects.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
       // #LOGIC: Fail-safe mechanism to prevent UI crashing on API error.
       console.error("Discovery Engine Failure:", error.message);
       return this.getFallbackNiches();
    }
  }

  /**
   * Failsafe hardcoded niches in case of API failure.
   * Ensures the user always has values to work with initially.
   */
  getFallbackNiches() {
    return [
      {
        title: "Cyberpunk Loft Restoration",
        potential: "High interest in retro-futurism and smart home builds.",
        sequence: ["Raw Concrete Shell", "Electrical Loom Installation", "LED Diffuser Trim", "Neon Cyber-Living Reveal"]
      },
      {
        title: "Underground Sci-Fi Bunker",
        potential: "Massive views for 'hidden space' and luxury isolation builds.",
        sequence: ["Dirt Pit Excavation", "Reinforced Concrete Foundation", "Glass Ceiling Seal", "Cinematic Luxury Reveal"]
      }
    ];
  }
}

export default ViralDiscoveryEngine;
