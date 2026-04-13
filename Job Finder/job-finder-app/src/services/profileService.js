/* 
 * PROFILE SERVICE (Modular V1.0 - Commercial SaaS Architecture)
 * Handles persistence for User Identities, Templates, and AI Stealth Keywords.
 * Separates Database DML operations from Vue Component state logic.
 */
import { supabase } from '../lib/supabase';

export const profileService = {
  /**
   * Upserts identity core data to the Supabase 'profiles' table.
   * @param {Object} user - The authenticated user object.
   * @param {Object} profileData - Raw reactive data from the UI.
   */
  async syncProfile(user, profileData) {
    if (!user) throw new Error("Unauthorized engine sync attempt");
    
    return await supabase.from('profiles').upsert({
      id: user.id,
      primary_color: profileData.primaryColor,
      secondary_color: profileData.secondaryColor,
      selected_template: profileData.selectedTemplate,
      secret_keywords: profileData.secretKeywords,
      resume_data: profileData.resumeData, // FULL NEURAL SNAPSHOT
      uploaded_cv_name: profileData.uploadedCvName,
      language_preference: profileData.languagePreference,
      name: profileData.name,
      email: user.email
    });
  },

  /**
   * Dedicated branding persistence for immediate visual theme sync.
   */
  async updateBranding(user, palette) {
    if (!user) return { error: 'Unauthorized branding sync' };
    
    return await supabase.from('profiles').update({
       primary_color: palette.primary,
       secondary_color: palette.secondary
    }).eq('id', user.id);
  },

  /**
   * Retrieves the extended profile for a specific user.
   * @param {string} userId - The unique UUID of the user.
   */
  async fetchProfile(userId) {
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  },

  /**
   * Logs a user event to the activity engine.
   */
  async logActivity(email, actionId) {
    return await supabase.from('user_activity').insert([
      { action: actionId, user_id: email }
    ]);
  },

  /**
   * Strategically logs a job application to the persistent activity engine.
   */
  async submitApplication(user, job) {
    if (!user) return { error: 'Unauthorized apply attempt' };
    
    // Log to global activity tracking for n8n/Supabase triggers
    return await supabase.from('user_activity').insert([
      { 
        action: 'JOB_APPLY', 
        user_id: user.email,
        details: { company: job.c, role: job.r, timestamp: new Date().toISOString() }
      }
    ]);
  },

  /**
   * Universal System Awareness: Fetches global maintenance/config flags.
   */
  async getSystemConfig() {
    const { data, error } = await supabase.from('system_config').select('*');
    if (error) throw error;
    return data.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
  },

  /**
   * Owner Command: Updates global system flags (Admin only).
   */
  async updateSystemConfig(key, value) {
    return await supabase
      .from('system_config')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key);
  }
};
