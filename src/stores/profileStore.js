import { defineStore } from "pinia";

export const useProfileStore = defineStore('profile', {
  state: () => ({
    member: {
      nickname: '',
      email: '',
      gender: '',
      region: '',
      sido: '',
      sigungu: '',
      profileImage: '',
      bio: null,
      createDate: '',
      modifyDate: ''
    },
    isNicknameDuplicate: null,
  }),
  actions: {
    setProfile(data) {
      const parsed = { ...data }

      const [sido, sigungu] = parsed.region.split(' ')
      parsed.sido = sido
      parsed.sigungu = sigungu
      parsed.profileImage = `${parsed.profileImage}`

      this.member = { ...this.member, ...parsed }
    }
  }
})