import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null
  }),
  actions: {
    save(accessToken) {
      this.accessToken = accessToken
    },
    clear() {
      this.accessToken = null
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.accessToken
  }
})