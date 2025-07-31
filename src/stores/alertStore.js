import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', {
  state: () => ({
    title: '',
    show: false,
    content: ''
  }),
  actions: {
    showSuccessAlert(message) {
      this.title = "성공"
      this.content = message
      this.show = true
    },
    showFailedAlert(message) {
      this.title = "실패"
      this.content = message
      this.show = true
    },
    showUnknownTitleAlert(title, message) {
      this.title = title
      this.content = message
      this.show = true
    },
    closeAlert() {
      this.show = false
    }
  }
})