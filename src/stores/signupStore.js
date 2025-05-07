import { defineStore } from 'pinia'

export const useSignupStore = defineStore('signup', {
  state: () => ({
    member: {
      nickname: '',
      gender: '',
      birth: '',
      sido: '',
      sigungu: '',
      bio: null,
      profileImage: null,
    },
    isNicknameDuplicate: null,
  }),
  actions: {
    setMember(data) {
      this.member = { ...this.member, ...data }
    },
    resetMember() {
      this.member = {
        nickname: '',
        gender: '',
        birth: '',
        sido: '',
        sigungu: '',
        bio: null,
        profileImage: null,
      }
      this.isNicknameDuplicate = null
    }
  },
})