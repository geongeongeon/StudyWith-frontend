import apiClient from "./api-client";
import { useAuthStore } from "../stores/authStore";

const domain = "auth";

export default {
  logout() {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken
    
    return apiClient.post(`${domain}/logout`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  },
};