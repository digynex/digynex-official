/* 
 * QUOTA SERVICE (Neural Governance Engine V1.0)
 * Enforces the 3-Tier subscription model and daily/weekly usage caps.
 */

import { supabase } from '../lib/supabase';

export const quotaService = {
  // Fallback defaults if offline
  TIERS: {
    0: {
      name: 'Tier 1 (Free)',
      cv_weekly_limit: 2,
      max_life_days: 14,
      keyword_limit: 5,
      country_slots: 1,
      features: ['Basic Templates', 'PDF Ingestion']
    },
    1: {
      name: 'Tier 2 ($19)',
      cv_weekly_limit: 6,
      cv_daily_limit: 3,
      keyword_limit: 15,
      country_slots: 3,
      features: ['Pro Templates', 'LinkedIn Sync', 'Aesthetic Presets']
    },
    2: {
      name: 'Tier 3 ($49)',
      cv_weekly_limit: 9999,
      cv_daily_limit: 9999,
      keyword_limit: 9999,
      country_slots: 10,
      price: 49,
      features: ['Unlimited Everything', 'All Templates', 'Neural Suggester', 'Cover Letter AI']
    }
  },

  updateTiersFromBackend(backendData) {
    if (!backendData) return;

    // WHY: DB may store data in two formats:
    //   Format A (named): { free:{...}, pro:{...}, elite:{...} } — saved by AdminHub
    //   Format B (numeric): { "0":{...}, "1":{...}, "2":{...} } — legacy format in DB
    // We normalize both so the quota engine always works correctly.

    // --- Format A: Named keys (AdminHub format) ---
    if (backendData.free) {
      if (backendData.free.cv_per_week !== undefined) this.TIERS[0].cv_weekly_limit = backendData.free.cv_per_week;
      if (backendData.free.day_cap !== undefined) this.TIERS[0].cv_daily_limit = backendData.free.day_cap;
      if (backendData.free.price !== undefined) this.TIERS[0].price = backendData.free.price;
      if (backendData.free.ai_magic !== undefined) this.TIERS[0].ai_magic = backendData.free.ai_magic;
    }
    if (backendData.pro) {
      if (backendData.pro.cv_per_week !== undefined) this.TIERS[1].cv_weekly_limit = backendData.pro.cv_per_week;
      if (backendData.pro.day_cap !== undefined) this.TIERS[1].cv_daily_limit = backendData.pro.day_cap;
      if (backendData.pro.price !== undefined) this.TIERS[1].price = backendData.pro.price;
      if (backendData.pro.ai_magic !== undefined) this.TIERS[1].ai_magic = backendData.pro.ai_magic;
    }
    if (backendData.elite) {
      if (backendData.elite.cv_per_week !== undefined) this.TIERS[2].cv_weekly_limit = backendData.elite.cv_per_week;
      if (backendData.elite.day_cap !== undefined) this.TIERS[2].cv_daily_limit = backendData.elite.day_cap;
      if (backendData.elite.price !== undefined) this.TIERS[2].price = backendData.elite.price;
      if (backendData.elite.ai_magic !== undefined) this.TIERS[2].ai_magic = backendData.elite.ai_magic;
    }

    // --- Format B: Numeric keys (legacy DB format {0,1,2}) ---
    const numericMap = { '0': 0, '1': 1, '2': 2 };
    for (const [key, tierIndex] of Object.entries(numericMap)) {
      const src = backendData[key];
      if (!src) continue;
      if (src.cv_weekly_limit !== undefined) this.TIERS[tierIndex].cv_weekly_limit = src.cv_weekly_limit;
      if (src.cv_daily_limit !== undefined) this.TIERS[tierIndex].cv_daily_limit = src.cv_daily_limit;
      if (src.price !== undefined) this.TIERS[tierIndex].price = src.price;
      if (src.ai_magic !== undefined) this.TIERS[tierIndex].ai_magic = src.ai_magic;
    }
  },

  async init() {
    try {
      // 1. Initial Fetch
      const { data, error } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'tiered_quotas')
        .single();
        
      if (data && data.value) {
        this.updateTiersFromBackend(data.value);
        console.log('[QUOTA ENGINE] Migrated configs from Backend Hub');
      }

      // 2. Real-time Realignment
      supabase.channel('system_config_quota_changes')
        .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'system_config', 
            filter: "key=eq.tiered_quotas" 
        }, (payload) => {
          if (payload.new && payload.new.value) {
            this.updateTiersFromBackend(payload.new.value);
            window.dispatchEvent(new CustomEvent('quota-prices-updated'));
            console.log('[QUOTA ENGINE] Real-time limits updated via Portal');
          }
        })
        .subscribe();
    } catch (err) {
      console.warn('[QUOTA ENGINE] Failed to sync with Backend. Using local strict rules.');
    }
  },

  getCountryLimit(planType) {
    const pType = (planType !== undefined) ? planType : 0;
    return this.TIERS[String(pType)]?.country_slots || this.TIERS[pType]?.country_slots || 1;
  },

  async checkLockoutStatus(profile) {
    if (!profile || profile.plan_type !== 0) return false;
    if (!profile.created_at) return false;
    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > this.TIERS[0].max_life_days;
  },

  /**
   * Calculates usage stats based on activity logs from Supabase.
   */
  async getUsageStats(userEmail) {
    if (!userEmail) return { weeklyCount: 0, dailyCount: 0 };
    
    try {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000)).toISOString();
        const oneWeekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString();

        // 1. Weekly Count
        const { count: weeklyCount, error: weekError } = await supabase
            .from('user_activity')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userEmail)
            .eq('action', 'CV_EXPORT')
            .gt('created_at', oneWeekAgo);

        if (weekError) throw weekError;

        // 2. Daily Count
        const { count: dailyCount, error: dayError } = await supabase
            .from('user_activity')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userEmail)
            .eq('action', 'CV_EXPORT')
            .gt('created_at', oneDayAgo);

        if (dayError) throw dayError;

        console.log(`[QUOTA ENGINE] Real-time usage for ${userEmail}: ${dailyCount}d / ${weeklyCount}w`);

        return {
          weeklyCount: weeklyCount || 0, 
          dailyCount: dailyCount || 0
        };
    } catch (error) {
        console.error('Error fetching real-time usage stats:', error);
        return { weeklyCount: 0, dailyCount: 0 };
    }
  },

  /**
   * Gatekeeper: Determines if a user can perform a CV action.
   */
  async canPerformAction(profile, actionId = 'CV_EXPORT') {
    // Determine user plan (default to 0 if undefined)
    const planType = (profile && profile.plan_type !== undefined) ? profile.plan_type : 0;
    
    // Super user or Tier 3 (plan_type 2) bypasses limits
    if ((profile && profile.is_admin) || planType === 2) {
      return { can: true };
    }

    // Enforce 14-day lock for Free tier (plan_type 0)
    if (planType === 0) {
      const isLocked = await this.checkLockoutStatus(profile);
      if (isLocked) {
        return { can: false, reason: 'ACCOUNT_LOCKED', limit: this.TIERS[0].max_life_days };
      }
    }

    // Check real usage from database (using email as ID)
    const stats = await this.getUsageStats(profile.email);
    const tier = this.TIERS[planType] || this.TIERS[0];

    // Weekly Check
    if (stats.weeklyCount >= tier.cv_weekly_limit) {
      return { can: false, reason: 'WEEKLY_LIMIT', limit: tier.cv_weekly_limit };
    }

    // Daily Check (Tier 1 has a daily limit)
    if (tier.cv_daily_limit && stats.dailyCount >= tier.cv_daily_limit) {
      return { can: false, reason: 'DAILY_LIMIT', limit: tier.cv_daily_limit };
    }

    return { can: true };
  },

  /**
   * Keyword Limit Enforcement
   */
  getKeywordLimit(planType) {
    const pType = (planType !== undefined) ? planType : 0;
    return this.TIERS[pType]?.keyword_limit || this.TIERS[0].keyword_limit;
  }
};
