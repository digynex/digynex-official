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
   * NEURAL BRIDGE: Direct Webhook Dispatcher
   * Immediately transmits the action to the n8n logic ecosystem in real-time.
   */
  async __dispatchToN8n(actionId, userId, details) {
    const webhookUrl = import.meta.env.VITE_N8N_SIGNAL_WEBHOOK || import.meta.env.VITE_N8N_PARSER_WEBHOOK;
    if (!webhookUrl) return { ok: false, status: 'EMPTY_URL' };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionId,
          user_id: userId,
          details: details,
          timestamp: new Date().toISOString()
        })
      });
      
      console.log(`[NEURAL_PULSE] Signal: ${actionId} | Status: ${response.status}`);
      return { ok: response.ok, status: response.status };
    } catch (error) {
      console.warn(`[NEURAL_PULSE] Signal Interrupted: ${actionId}`, error);
      return { ok: false, status: 'NETWORK_ERROR', message: error.message };
    }
  },

  async testConnection() {
    return await this.__dispatchToN8n('NEURAL_PULSE', 'system_identity', { status: 'ping' });
  },

  /**
   * Logs a user event to the activity engine.
   */
  async logActivity(email, actionId, details = {}) {
    this.__dispatchToN8n(actionId, email, details);
    return await supabase.from('user_activity').insert([
      { action: actionId, user_id: email, details }
    ]);
  },

  /**
   * Strategically logs a job application to the persistent activity engine.
   */
  async submitApplication(user, job) {
    if (!user) return { error: 'Unauthorized apply attempt' };
    
    const details = { 
        status: 'instant',
        job: job, // FULL PAYLOAD
        company: job.c, 
        role: job.r, 
        target_company_email: 'info@infodigynex.se', // Test Company Email
        user_phone: '+46769703311', // Test Phone Number for WA
        timestamp: new Date().toISOString() 
    };
    this.__dispatchToN8n('JOB_APPLY', user.email, details);

    // Log to global activity tracking for n8n/Supabase triggers
    return await supabase.from('user_activity').insert([
      { action: 'JOB_APPLY', user_id: user.email, details }
    ]);
  },

  /**
   * TRIGGER HEADLESS APPLY (Workflow E)
   * High-fidelity dispatch to the Puppeteer executor with full identity hydration.
   */
  async triggerHeadlessApply(user, job, profile) {
    if (!user) throw new Error("Unauthorized");
    if (!job?.u) throw new Error("Target URL Missing");

    // 1. Guardrail: Identity Verification Check
    if (profile.doc_status !== 'Verified') {
        return { error: 'IDENTITY_UNVERIFIED', message: 'Please verify your ID in Profile settings first.' };
    }

    const payload = {
        job_url: job.u,
        company: job.c || job.company,
        role: job.r || job.role,
        resume_data: profile.resume_data,
        cover_letter: profile.cover_letter,
        user_id: user.email,
        timestamp: new Date().toISOString()
    };

    // 2. Dispatch Signal to n8n
    const signal = await this.__dispatchToN8n('QUICK_APPLY', user.email, payload);
    
    // 3. Persistent Logging
    await supabase.from('user_activity').insert([
      { action: 'QUICK_APPLY', user_id: user.email, details: payload }
    ]);

    return signal;
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
    const fullActionId = `ADMIN_${actionId.toUpperCase()}`;
    const fullDetails = { ...details, timestamp: new Date().toISOString() };
    
    this.__dispatchToN8n(fullActionId, adminEmail, fullDetails);

    return await supabase.from('user_activity').insert([
      { action: fullActionId, user_id: adminEmail, details: fullDetails }
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
    const details = { 
        company: job.c, 
        role: job.r, 
        apply_email: professionalEmail,
        synthesis: synthesisData,
        timestamp: new Date().toISOString() 
    };

    this.__dispatchToN8n('HEADLESS_BROADCAST_SIGNAL', user.email, details);

    return await supabase.from('user_activity').insert([
      { action: 'HEADLESS_BROADCAST_SIGNAL', user_id: user.email, details }
    ]);
  },

  /**
   * STEP 6: MANUAL ASSIST SIGNAL (TIER B)
   * Tracks when a user opens the 1-click toolkit for manual portal submission.
   */
  async submitManualAssistSignal(user, job) {
    if (!user) return { error: 'Unauthorized signal' };
    
    const details = { company: job.c, role: job.r, timestamp: new Date().toISOString() };
    this.__dispatchToN8n('MANUAL_ASSIST_TOOLKIT_SYNC', user.email, details);

    return await supabase.from('user_activity').insert([
      { action: 'MANUAL_ASSIST_TOOLKIT_SYNC', user_id: user.email, details }
    ]);
  },

  /**
   * NEURAL ENGINE: Cover Letter Synthesis Logic
   * Generates a high-fidelity drafting based on CV specimens and Job details.
   */
  generateCoverLetter(data) {
    const { name, resume_data, job } = data;
    const fullName = resume_data?.basic?.fullName || name || 'Professional Candidate';
    
    let letter = ""; // Start clean (Template will provide the date and greeting)
    
    if (job) {
       letter += `I am writing to express my strong interest in the ${job.r || job.role} position at ${job.c || job.company}, as discovered through the DigyNex AI matching engine.\n\n`;
    } else {
       letter += `I am writing to express my interest in joining your organization in a capacity where my experience in strategic operations and technical leadership can drive significant value.\n\n`;
    }

    if (resume_data?.bio) {
        letter += `${resume_data.bio}\n\n`;
    }

    if (resume_data?.experiences && resume_data.experiences.length > 0) {
        const topExp = resume_data.experiences[0];
        if (topExp.role && topExp.company) {
            letter += `During my tenure as ${topExp.role} at ${topExp.company}, I specialized in delivering high-impact solutions and driving operational excellence.\n\n`;
        }
    }

    // --- NEURAL FIX: Use real technical skills only, ignore ATS stealth keywords here ---
    const technicalSkills = resume_data?.skills?.hard || [];
    if (technicalSkills.length > 0) {
        letter += `My core technical stack includes ${technicalSkills.slice(0, 6).join(', ')}, which aligns directly with the requirements of this role.\n\n`;
    }

    letter += `I look forward to the possibility of discussing how my background and future-facing skills can benefit your team.`;
    
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
