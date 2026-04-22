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
      price: 0,
      country_slots: 1,
      features: ['Basic Templates', 'PDF Ingestion']
    },
    1: {
      name: 'Tier 2 ($19)',
      cv_weekly_limit: 6,
      cv_daily_limit: 3,
      keyword_limit: 15,
      price: 29,
      country_slots: 3,
      features: ['Pro Templates', 'LinkedIn Sync', 'Aesthetic Presets']
    },
    2: {
      name: 'Tier 3 ($49)',
      cv_weekly_limit: 9999,
      cv_daily_limit: 9999,
      keyword_limit: 9999,
      price: 49,
      country_slots: 10,
      features: ['Unlimited Everything', 'All Templates', 'Neural Suggester', 'Cover Letter AI']
    }
  },

  /**
   * Internal Helper: Normalizes a plan type string/number to a numeric index (0, 1, 2)
   */
  normalizePlanType(plan) {
    if (plan === 0 || plan === '0' || plan === 'free') return 0;
    if (plan === 1 || plan === '1' || plan === 'pro' || plan === 'growth') return 1;
    if (plan === 2 || plan === '2' || plan === 'elite') return 2;
    return 0; // Default to Free
  },

  updateTiersFromBackend(backendData) {
    if (!backendData) return;

    console.log('[QUOTA ENGINE] Synchronizing with Backend Strategics:', backendData);

    // Normalize Format A: Named keys (free, pro, elite)
    const namedMap = { 'free': 0, 'pro': 1, 'elite': 2 };
    for (const [key, index] of Object.entries(namedMap)) {
      const src = backendData[key];
      if (!src) continue;
      
      const target = this.TIERS[index];
      if (src.cv_per_week !== undefined) target.cv_weekly_limit = src.cv_per_week;
      if (src.day_cap !== undefined) target.cv_daily_limit = src.day_cap;
      if (src.price !== undefined) target.price = src.price;
      if (src.ai_magic !== undefined) target.ai_magic = src.ai_magic;
      if (src.country_slots !== undefined) target.country_slots = src.country_slots;
      
      // Also handle legacy keys in the backend data if they exist
      if (src.cv_weekly_limit !== undefined) target.cv_weekly_limit = src.cv_weekly_limit;
      if (src.cv_daily_limit !== undefined) target.cv_daily_limit = src.cv_daily_limit;
    }

    // Normalize Format B: Numeric keys ('0', '1', '2')
    const numericMap = { '0': 0, '1': 1, '2': 2 };
    for (const [key, index] of Object.entries(numericMap)) {
      const src = backendData[key];
      if (!src) continue;
      
      const target = this.TIERS[index];
      if (src.cv_weekly_limit !== undefined) target.cv_weekly_limit = src.cv_weekly_limit;
      if (src.cv_per_week !== undefined) target.cv_weekly_limit = src.cv_per_week;
      if (src.cv_daily_limit !== undefined) target.cv_daily_limit = src.cv_daily_limit;
      if (src.day_cap !== undefined) target.cv_daily_limit = src.day_cap;
      if (src.price !== undefined) target.price = src.price;
      if (src.ai_magic !== undefined) target.ai_magic = src.ai_magic;
      if (src.country_slots !== undefined) target.country_slots = src.country_slots;
    }
  },

  async init() {
    try {
      // 1. Initial Fetch
      const { data } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'tiered_quotas')
        .single();
        
      if (data && data.value) {
        this.updateTiersFromBackend(data.value);
        console.log('[QUOTA ENGINE] Neural Config Hydrated');
      }

      // 2. Real-time Subscription
      supabase.channel('system_config_quota_changes')
        .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'system_config', 
            filter: "key=eq.tiered_quotas" 
        }, (payload) => {
          if (payload.new && payload.new.value) {
            this.updateTiersFromBackend(payload.new.value);
            window.dispatchEvent(new CustomEvent('quota-prices-updated', { detail: payload.new.value }));
            console.log('[QUOTA ENGINE] Real-time Ripple: Config Updated');
          }
        })
        .subscribe();
    } catch (err) {
      console.warn('[QUOTA ENGINE] Fallback to Hardcoded Strict Rules');
    }
  },

  getCountryLimit(planType) {
    const index = this.normalizePlanType(planType);
    return this.TIERS[index]?.country_slots || 1;
  },

  async checkLockoutStatus(profile) {
    const index = this.normalizePlanType(profile?.plan_type);
    if (index !== 0) return false; // Only free tier has 14-day lock
    
    if (!profile.created_at) return false;
    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > this.TIERS[0].max_life_days;
  },

  async getUsageStats(userEmail) {
    if (!userEmail) return { weeklyCount: 0, dailyCount: 0 };
    
    // NEURAL ACTION SINK: Unified quota enforcement for all expenditures
    const ACTION_SINK = ['CV_EXPORT', 'JOB_APPLY', 'QUICK_APPLY', 'CL_EXPORT', 'HEADLESS_BROADCAST_SIGNAL', 'MANUAL_ASSIST_TOOLKIT_SYNC'];

    try {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000)).toISOString();
        const oneWeekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString();

        const { data: weeklyData } = await supabase
            .from('user_activity')
            .select('created_at')
            .eq('user_id', userEmail)
            .in('action', ACTION_SINK)
            .gt('created_at', oneWeekAgo);

        const { data: dailyData } = await supabase
            .from('user_activity')
            .select('created_at')
            .eq('user_id', userEmail)
            .in('action', ACTION_SINK)
            .gt('created_at', oneDayAgo)
            .order('created_at', { ascending: true });

        return {
          weeklyCount: weeklyData?.length || 0, 
          dailyCount: dailyData?.length || 0,
          oldestDaily: dailyData?.[0]?.created_at,
          oldestWeekly: weeklyData?.[0]?.created_at
        };
    } catch (error) {
        return { weeklyCount: 0, dailyCount: 0 };
    }
  },

  async canPerformAction(profile, actionId = 'CV_EXPORT') {
    if (!profile) return { can: false, reason: 'AUTH_REQUIRED' };
    
    const index = this.normalizePlanType(profile.plan_type);
    
    // Super user or Tier 3 (Elite) bypasses limits
    if (profile.is_admin || index === 2 || profile.isSuperUser) {
      return { can: true };
    }

    // 14-day lock for Free tier
    if (index === 0) {
      const isLocked = await this.checkLockoutStatus(profile);
      if (isLocked) {
        return { can: false, reason: 'ACCOUNT_LOCKED', limit: this.TIERS[0].max_life_days };
      }
    }

    const stats = await this.getUsageStats(profile.email);
    const tier = this.TIERS[index];

    if (index === 0) {
      // Free Tier: Strictly Weekly Limit
      if (stats.weeklyCount >= tier.cv_weekly_limit) {
        const nextDate = stats.oldestWeekly ? new Date(new Date(stats.oldestWeekly).getTime() + (7 * 24 * 60 * 60 * 1000)) : null;
        return { can: false, reason: 'WEEKLY_LIMIT', limit: tier.cv_weekly_limit, nextActivation: nextDate };
      }
    } else {
      // Pro Tier (and others if not bypassed): Strictly Daily Limit
      if (tier.cv_daily_limit && stats.dailyCount >= tier.cv_daily_limit) {
        const nextDate = stats.oldestDaily ? new Date(new Date(stats.oldestDaily).getTime() + (24 * 60 * 60 * 1000)) : null;
        return { can: false, reason: 'DAILY_LIMIT', limit: tier.cv_daily_limit, nextActivation: nextDate };
      }
    }

    return { can: true };
  },

  getKeywordLimit(planType) {
    const index = this.normalizePlanType(planType);
    return this.TIERS[index]?.keyword_limit || 5;
  }
};
