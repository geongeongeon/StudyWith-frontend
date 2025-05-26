import { useAuthStore } from "../stores/authStore";
import apiClient from "./api-client";

const domain = "members";

export default {
  createMember(memberCreateDTO) {
    return apiClient.post(`${domain}`, memberCreateDTO, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  validNickname(nickname) {
    return apiClient.get(`${domain}/exists`, {
      params: {nickname}
    });
  },
  getMemberDetail() {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.get(`${domain}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  },
  updateMember(memberUpdateDTO) {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.put(`${domain}/me`, memberUpdateDTO, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
  },
  deleteMember() {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.delete(`${domain}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }
};