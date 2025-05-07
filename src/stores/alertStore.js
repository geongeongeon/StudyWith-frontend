import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', {
  state: () => ({
    show: false,
    contant: ''
  }),
  actions: {
    showAlert(message) {
      this.contant = message
      this.show = true
    },
    closeAlert() {
      this.show = false
    }
  }
})