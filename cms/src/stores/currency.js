import { defineStore } from 'pinia'
import axios from 'axios'

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    countryCode: localStorage.getItem('user_country') || 'LK',
    currency: 'LKR',
    symbol: 'LKR',
    // New Tiered Pricing Structure (Adaptive SaaS Model)
    pricing: {
      starter: 2500,
      growth: 12000,
      scale: 18000
    },
    taxRate: 0,
    isLoaded: false,
  }),

  getters: {
    // Basic price getters with tax
    starterPrice: (state) => state.pricing.starter * (1 + state.taxRate),
    growthPrice: (state) => state.pricing.growth * (1 + state.taxRate),
    scalePrice: (state) => state.pricing.scale * (1 + state.taxRate),
  },

  actions: {
    async initialize() {
      if (this.isLoaded) return

      try {
        const res = await axios
          .get('https://ipapi.co/json/')
          .catch(() => axios.get('https://ip-api.com/json/'))

        if (res.data) {
          const code = res.data.country_code || res.data.countryCode
          if (code) {
            this.setCountryCode(code)
          }
        }
      } catch (error) {
        console.warn('Currency detection failed, using defaults', error)
      }

      this.updateStateByCountry()
      this.isLoaded = true
    },

    setCountryCode(code) {
      if (!code) return
      this.countryCode = code
      localStorage.setItem('user_country', code)
      this.updateStateByCountry()
    },

    updateStateByCountry() {
      // 🇱🇰 SRI LANKA - Local Fixed Strategy
      if (this.countryCode === 'LK' || this.countryCode === 'SL') {
        this.currency = 'LKR'
        this.symbol = 'LKR'
        this.pricing = {
          starter: 2500,
          growth: 12000,
          scale: 18000
        }
        this.taxRate = 0
      }
      // 🇸🇪 SWEDEN / EU - Premium Core Region
      else if (this.countryCode === 'SE') {
        this.currency = 'SEK'
        this.symbol = 'kr'
        this.pricing = {
          starter: 299,
          growth: 799,
          scale: 1499
        }
        this.taxRate = 0.25 // Sweden VAT
      }
      // 🌎 GLOBAL / US DEFAULT - Unified SaaS Strategy
      else {
        this.currency = 'USD'
        this.symbol = '$'
        this.pricing = {
          starter: 29,
          growth: 79,
          scale: 149
        }
        this.taxRate = 0.05 // Global general duty/tax
      }
    },

    format(amount) {
      if (amount === undefined || amount === null) return ''
      const formatted = Number(amount).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })

      if (this.currency === 'SEK') {
        return `${formatted} ${this.symbol}`
      }
      return `${this.symbol} ${formatted}`
    },

    formatShort(val) {
      if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M'
      if (val >= 1000) return (val / 1000).toFixed(1) + 'k'
      return val
    },
  },
})
