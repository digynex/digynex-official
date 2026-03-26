import { reactive } from 'vue'

export const brandingStore = reactive({
  productName: 'DigyNex',
  productSuffix: '360',
  currency: 'LKR'
})

export const setProductName = (name) => {
  brandingStore.productName = name
}
