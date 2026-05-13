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
      phone: profileData.phone, // SYNC: Contact Phone for Bot
      linkedin_session: profileData.linkedinSession, // STEALTH: li_at cookie
      linkedin_jsessionid: profileData.linkedinJsessionid, // WORLDWIDE: CSRF Token
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
    const webhookUrl = '/data-sync';
    
    if (!webhookUrl) return { ok: false, status: 'EMPTY_URL' };

    try {
      // --- NEURAL SIGNAL: LOCATION MAPPING ENGINE ---
      const countryMap = {
        'sweden': 'SE', 'germany': 'DE', 'united kingdom': 'UK', 'uk': 'UK',
        'france': 'FR', 'italy': 'IT', 'spain': 'ES', 'netherlands': 'NL',
        'portugall': 'PT', 'usa': 'US', 'united states': 'US'
      };
      
      const jobLocation = (details?.location || "").toLowerCase();
      const mappedLocation = countryMap[jobLocation] || details?.location || 'SE';

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // 🏁 Level 1: Flat keys for Master Router & direct n8n access
          action: actionId,
          user_id: userId,
          job_url: details?.job_url || "https://www.linkedin.com/jobs/",
          
          // 📦 Level 2: Wrapped 'body' object for Cookie Prep node
          body: {
            action: actionId,
            user_id: userId,
            job_url: details?.job_url || "https://www.linkedin.com/jobs/",
            details: details,
            cookie: details?.linkedin_session || "",
            jsessionid: details?.linkedin_jsessionid || ""
          },
          
          // 📑 Level 3: Extra metadata
          timestamp: new Date().toISOString(),
          user_uuid: details?.user_uuid || null
        })
      });
      
      return { ok: response.ok, status: response.status, message: response.statusText };
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
        job_url: job.u || job.url || '',
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
    try {
        // 🚀 Neural Override: Bypass all local identity gates.
        // We trust the UI context and let the server-side verify.
        
        // 🛡️ Neural Identity Hardening: Fallback through all possible identity sources
        const resolvedEmail = user?.email || profile?.email || "amilawijayantha858@gmail.com"; 
        
        const payload = {
            action: 'JOB_APPLY',
            job_url: job?.u || job?.url || "https://www.linkedin.com/jobs/", // Strategic Fallback
            company: job?.c || job?.company || "Strategic Target",
            role: job?.r || job?.role || "Neural Role",
            applicant_name: profile?.name || user?.user_metadata?.full_name || "Expert Candidate",
            user_id: resolvedEmail,
            user_uuid: profile?.id || null,
            linkedin_session: profile?.linkedin_session || null,
            linkedin_jsessionid: profile?.linkedin_jsessionid || null,
            resume_data: profile?.resume_data || {},
            timestamp: new Date().toISOString(),
            dispatch_version: "V25.2.1-PROD"
        };

        return await this.__dispatchToN8n('JOB_APPLY', resolvedEmail, payload);
    } catch (err) {
        console.error('[profileService.triggerHeadlessApply] INTERNAL ERROR:', err);
        return { error: 'INTERNAL_ERROR', message: err.message, ok: false };
    }
  },

  /**
   * V18.5 POST-CHARGE SYNC
   * This is called by the n8n executor OR the proxy layer after a verified successful apply.
   * It triggers the QUICK_APPLY_SUCCESS action which is the only one counted by the Quota Engine.
   */
  async confirmHeadlessSuccess(email, jobDetails, screenshotUrl) {
    const details = {
        ...jobDetails,
        status: 'SUCCESS',
        screenshot_proxy: screenshotUrl,
        timestamp: new Date().toISOString()
    };

    // 1. Trigger Quota Charge (via user_activity log)
    await supabase.from('user_activity').insert([
      { action: 'QUICK_APPLY_SUCCESS', user_id: email, details }
    ]);

    // 2. Dispatch Proxy Signal for WhatsApp/Telegram Relay
    return await this.__dispatchToN8n('IMAGE_PROXY_RELAY', email, {
        screenshot: screenshotUrl,
        company: jobDetails.company || jobDetails.c,
        role: jobDetails.role || jobDetails.r
    });
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
        job_url: job?.u || job?.url || job?.apply_url || "",
        company: job.c || job.company, 
        role: job.r || job.role, 
        apply_email: professionalEmail,
        user_phone: user.phone || "",
        location: user.location || "",
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
    const experiences = resume_data?.experiences || [];
    const bio = resume_data?.bio || '';
    const technicalSkills = resume_data?.skills?.hard || [];
    
    let letter = `Dear Hiring Manager,\n\n`;
    
    if (job) {
       letter += `I am writing to express my strong interest in the ${job.r || job.role} position at ${job.c || job.company}, as identified by the DigyNex Neural Matching engine.\n\n`;
    }

    // NARRATIVE: Start with a professional summary or bio
    if (bio) {
        letter += `${bio}\n\n`;
    }

    // EXPERIENCE: Integrate company names naturally
    if (experiences.length > 0) {
        const primaryExp = experiences.find(e => e.isCurrent) || experiences[0];
        const companies = [...new Set(experiences.filter(e => e.company).map(e => e.company))].slice(0, 3);
        
        if (primaryExp.role && primaryExp.company) {
            letter += `In my recent tenure as ${primaryExp.role} at ${primaryExp.company}, I have consistently delivered high-impact solutions. `;
        }
        
        if (companies.length > 1) {
            letter += `My professional journey across organizations like ${companies.join(' and ')} has equipped me with a deep understanding of complex operational environments.\n\n`;
        } else {
            letter += `\n\n`;
        }
    }

    // SKILLS: Clean technical stack only
    if (technicalSkills.length > 0) {
        // Filter out things that look like company names (heuristic)
        const cleanSkills = technicalSkills.filter(s => s.length < 20 && !s.includes('Ltd') && !s.includes('Corp')).slice(0, 6);
        letter += `My core technical expertise in ${cleanSkills.join(', ')} aligns perfectly with the requirements of this role and your team's objectives.\n\n`;
    }

    letter += `I am confident that my background and passion for innovation would make me a valuable asset to your team. I look forward to the possibility of discussing how my skills could benefit your organization.\n\nSincerely,\n${fullName}`;
    
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
