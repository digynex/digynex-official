/* 
 * JOB SERVICE (Modular V1.0 - Commercial SaaS Architecture)
 * Responsible for fetching discovered jobs and personal applications from Supabase.
 * Strictly follows Rule 1: Engine first.
 */
import { supabase } from '../lib/supabase';

export const jobService = {
  /**
   * Triggers the Neural Engine (n8n) Scraper for real-time discovery.
   * @param {string} keyword - Search term (e.g., 'Developer')
   * @param {string} country - Country code (e.g., 'gb')
   * @param {string} email - User identifier for quota tracking
   */
  async searchJobs(keyword, country, email, city = '') {
    const webhookUrl = import.meta.env.VITE_N8N_SCRAPER_WEBHOOK;
    if (!webhookUrl) {
      console.error('Neural Scraper Error: Webhook URL not configured in .env');
      return [];
    }

    try {
      const response = await fetch(`${webhookUrl}?keyword=${encodeURIComponent(keyword)}&country=${encodeURIComponent(country)}&email=${encodeURIComponent(email)}&city=${encodeURIComponent(city)}`);
      if (!response.ok) throw new Error('Neural Scraper Connection Failure');
      return await response.json();
    } catch (err) {
      console.error('Job Engine Search Error:', err.message);
      return [];
    }
  },

  /**
   * Fetches real-time job matches (Discovery Stream) from the latest neural cache.
   * @param {string} country - Optional country name to filter cache (e.g., 'Sweden')
   */
  async getDiscoveryJobs(country = null) {
    // We grab the most recent scrape result to populate the dashboard on load
    let query = supabase
      .from('job_scrapes')
      .select('jobs, search_key')
      .order('created_at', { ascending: false });

    if (country) {
      query = query.ilike('search_key', `%_${country.toLowerCase()}%`);
    }

    const { data, error } = await query.limit(1).maybeSingle();

    if (error) {
      console.error('Job Engine Discovery Error:', error.message);
      return [];
    }
    
    if (!data) return [];

    // Map JSONB structure to UI format
    return (data.jobs || []).map(j => ({
       id: j.id,
       company: j.company,
       role: j.title || j.role,
       location: j.location,
       match_score: j.match_score || 0,
       posted_at: 'Recently Discovered',
       hex_color: '#0A2647',
       description: j.description
    }));
  },

  /**
   * Fetches user-specific job applications.
   * @param {string} userEmail - Used to link with user_activity or personal logs.
   */
  async getMyApplications(userEmail) {
    if (!userEmail) return [];
    
    // In a full implementation, we'd have a 'user_jobs' join table.
    // For now, we'll return discovery jobs that the user has interacted with
    // in the 'user_activity' table, or simply return a subset.
    const { data, error } = await supabase
      .from('user_activity')
      .select('details')
      .eq('user_id', userEmail)
      .eq('action', 'JOB_APPLY');

    if (error) {
       console.error('Job Engine Pipeline Error:', error.message);
       return [];
    }
    
    return data.map(log => log.details);
  }
};
