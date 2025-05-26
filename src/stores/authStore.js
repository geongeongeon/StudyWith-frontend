import { defineStore } from 'pinia'
import authService from '../api/auth-service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    nickname: null,
    profileImage: null,
    accessToken: null
  }),
  actions: {
    save(nickname, profileImage, accessToken) {
      this.nickname = nickname
      this.profileImage = profileImage
      this.accessToken = accessToken
    },
    clear() {
      this.nickname = null
      this.profileImage = null
      this.accessToken = null
    },
    async autoRefresh() {
      const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'

      if (!this.accessToken && isLoggedIn) {
        try {
          const response = await authService.refresh();
          const nickname = response.data.data.nickname
          const profileImage = response.data.data.profileImage
          const newAccessToken = response.headers.authorization.substring(7);
          
          this.save(nickname, profileImage, newAccessToken);
        } catch (error) {
          this.clear();
        }
      }
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.accessToken
  }
})