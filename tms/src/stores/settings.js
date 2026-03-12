import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    printerName: '',
    useCameraScan: false,
  }),

  persist: true,

  actions: {
    setPrinterName(name) {
      this.printerName = name
    },
    setCameraScanMode(enabled) {
      this.useCameraScan = enabled
    }
  }
})
