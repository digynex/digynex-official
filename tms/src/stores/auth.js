import { defineStore } from 'pinia'
import { supabase } from 'boot/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    loading: false,
    selectedOrgId: null,
    isDemo: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user || state.isDemo,
    isSuperAdmin: (state) => state.profile?.role === 'super_admin' && !state.isDemo,
    userOrgId: (state) => state.isDemo ? 'demo-org-id' : (state.selectedOrgId || state.profile?.org_id),
  },

  actions: {
    async fetchProfile() {
      if (!this.user) return

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', this.user.id)
          .single()

        if (error) throw error
        this.profile = data
        this.selectedOrgId = data.org_id
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    },

    setOrganization(orgId) {
      if (this.isSuperAdmin) {
        this.selectedOrgId = orgId
      }
    },

    async initialize() {
      this.loading = true
      const { data: { session } } = await supabase.auth.getSession()
      this.user = session?.user || null
      if (this.user) {
        this.isDemo = false // Logged in user overrides demo
        await this.fetchProfile()
      }
      this.loading = false
    },

    enterDemoMode() {
      this.user = null
      this.profile = { name: 'Guest Explorer', role: 'admin' }
      this.isDemo = true
    },

    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.profile = null
      this.isDemo = false
    }
  }
})
