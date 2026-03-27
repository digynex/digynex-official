import { reactive } from 'vue'

export const brandingStore = reactive({
  productName: 'DigyNex',
  productSuffix: '360',
  currency: 'LKR',
  // Organization Details (SaaS Tenant Branding)
  companyName: 'DigyNex Head Office',
  address: 'No 45, High-Performance Tech Hub, Colombo, Sri Lanka',
  contactEmail: 'operations@digynex.se',
  taxId: 'VAT-SL-2026-9901',
  website: 'https://digynex.se',
  logoUrl: 'https://raw.githubusercontent.com/amilawijayantha/digynex-assets/main/logo-dark.png',
  primaryColor: '#6366f1'
})

export const setBranding = (data) => {
  Object.assign(brandingStore, data)
}
