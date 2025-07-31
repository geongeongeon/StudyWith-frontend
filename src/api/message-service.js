import { useAuthStore } from "../stores/authStore";
import apiClient from "./api-client";

const domain = "messages";

export default {
  sendMessage(messageSendDTO) {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.post(`${domain}`, messageSendDTO, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
  },
  getMessages() {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.get(`${domain}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
  },
  getMessageDetail(id) {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.get(`${domain}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
  },
  deleteAllMessages() {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.delete(`${domain}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
  },
  deleteMessage(id) {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.delete(`${domain}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
  },
};