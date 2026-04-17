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
      email: user.email,
      cover_letter: profileData.coverLetterText // SYNC: Persistent Identity Letter
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
   * Universal Profile Update: Handles targeted field updates for statuses like 'doc_status'.
   */
  async updateProfile(userId, updates) {
    if (!userId) return { error: 'No ID provided for update' };
    return await supabase.from('profiles').update(updates).eq('id', userId);
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
  async logActivity(email, actionId, details = {}) {
    return await supabase.from('user_activity').insert([
      { action: actionId, user_id: email, details }
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
  },

  /**
   * Executive Command: Fetches every user specimen for the Admin Hub.
   */
  async fetchAllProfiles() {
    return await supabase
      .from('profiles')
      .select('id, name, email, plan_type, is_admin, is_suspended, doc_status, created_at')
      .order('created_at', { ascending: false });
  },

  /**
   * Executive Command: Forces a tier override for a specimen.
   */
  async updateUserTier(userId, tier) {
    return await supabase
      .from('profiles')
      .update({ plan_type: tier })
      .eq('id', userId);
  },

  /**
   * Executive Command: Elevates or revokes the Neural Shield (Admin status).
   */
  async updateAdminStatus(userId, isAdmin) {
    return await supabase
      .from('profiles')
      .update({ is_admin: isAdmin })
      .eq('id', userId);
  },

  /**
   * Logistical Command: Triggers a global administrative action (Broadcast/Purge/Sync).
   */
  async triggerAdminGlobalAction(adminEmail, actionId, details = {}) {
    return await supabase.from('user_activity').insert([
      { 
        action: `ADMIN_${actionId.toUpperCase()}`, 
        user_id: adminEmail,
        details: { ...details, timestamp: new Date().toISOString() }
      }
    ]);
  },

  /**
   * STEP 6: HEADLESS BROADCAST ENGINE (KINETIC SIGNAL)
   * Dispatches a signal to the n8n/Playwright logic for automated job applications.
   */
  async triggerHeadlessBroadcast(user, job, synthesisData) {
    if (!user) return { error: 'Unauthorized broadcast' };
    
    // IDENTITY LOGIC: Prioritize applicationEmail for professional consistency
    const professionalEmail = user.applicationEmail || user.email;

    return await supabase.from('user_activity').insert([
      { 
        action: 'HEADLESS_BROADCAST_SIGNAL', 
        user_id: user.email,
        details: { 
          company: job.c, 
          role: job.r, 
          apply_email: professionalEmail,
          synthesis: synthesisData,
          timestamp: new Date().toISOString() 
        }
      }
    ]);
  },

  /**
   * STEP 6: MANUAL ASSIST SIGNAL (TIER B)
   * Tracks when a user opens the 1-click toolkit for manual portal submission.
   */
  async submitManualAssistSignal(user, job) {
    if (!user) return { error: 'Unauthorized signal' };
    
    return await supabase.from('user_activity').insert([
      { 
        action: 'MANUAL_ASSIST_TOOLKIT_SYNC', 
        user_id: user.email,
        details: { 
          company: job.c, 
          role: job.r, 
          timestamp: new Date().toISOString() 
        }
      }
    ]);
  },

  /**
   * NEURAL ENGINE: Cover Letter Synthesis Logic
   * Generates a high-fidelity drafting based on CV specimens and Job details.
   */
  generateCoverLetter(data) {
    const { name, resume_data, secret_keywords, job } = data;
    const fullName = resume_data?.basic?.fullName || name || 'Professional Candidate';
    
    let letter = `Dear Hiring Manager,\n\n`;
    
    if (job) {
       letter += `I am writing to express my strong interest in the ${job.r || job.role} position at ${job.c || job.company} in ${job.l || job.location}, as discovered through the DigyNex AI matching engine.\n\n`;
    } else {
       letter += `I am writing to express my interest in joining your organization in a capacity where my experience in high-scale architecture and neural systems can drive strategic value.\n\n`;
    }

    if (resume_data?.bio) {
        letter += `${resume_data.bio}\n\n`;
    }

    if (resume_data?.experiences && resume_data.experiences.length > 0) {
        const topExp = resume_data.experiences[0];
        if (topExp.role && topExp.company) {
            letter += `During my tenure as ${topExp.role} at ${topExp.company}, I have specialized in delivering high-impact solutions. ${topExp.achievements || ''}\n\n`;
        }
    }

    const skills = resume_data?.skills?.hard || secret_keywords || [];
    if (skills.length > 0) {
        letter += `My core technical stack includes ${skills.slice(0, 6).join(', ')}, making me a strong candidate for this role's requirements.\n\n`;
    }

    letter += `I look forward to the possibility of discussing how my background and future-facing skills can benefit your team.\n\nSincerely,\n\n${fullName}`;
    
    return letter;
  },

  /**
   * KINETIC SYNC: Persists the cover letter specimen to Supabase.
   */
  async updateCoverLetter(userId, text) {
    if (!userId) return { error: 'Unauthorized cover letter update' };
    return await supabase.from('profiles').update({
       cover_letter: text
    }).eq('id', userId);
  },

  /**
   * Executive Override: Manually update a user's core identity (Admin only).
   */
  async adminUpdateProfile(userId, updates) {
    return await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
  }
};
