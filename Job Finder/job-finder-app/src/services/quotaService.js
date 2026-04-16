/* 
 * QUOTA SERVICE (Neural Governance Engine V1.0)
 * Enforces the 3-Tier subscription model and daily/weekly usage caps.
 */

import { supabase } from '../lib/supabase';

export const quotaService = {
  // ... existing TIERS ...
  TIERS: {
    0: {
      name: 'Tier 1 (Free)',
      cv_weekly_limit: 2,
      max_life_days: 14,
      keyword_limit: 5,
      features: ['Basic Templates', 'PDF Ingestion']
    },
    1: {
      name: 'Tier 2 ($19)',
      cv_weekly_limit: 6,
      cv_daily_limit: 3,
      keyword_limit: 15,
      features: ['Pro Templates', 'LinkedIn Sync', 'Aesthetic Presets']
    },
    2: {
      name: 'Tier 3 ($49)',
      cv_weekly_limit: Infinity,
      cv_daily_limit: Infinity,
      keyword_limit: Infinity,
      features: ['Unlimited Everything', 'All Templates', 'Neural Suggester', 'Cover Letter AI']
    }
  },

  // ... existing checkLockoutStatus ...
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
