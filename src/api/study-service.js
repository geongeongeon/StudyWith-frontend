import { useAuthStore } from "../stores/authStore";
import apiClient from "./api-client";

const domain = "studies";

export default {
  createStudy(formData) {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.post(`${domain}`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  requestToJoinStudy(id) {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.post(`${domain}/${id}/join-requests`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }   
    })
  },
  acceptJoinRequest(id, memberId) {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.post(`${domain}/${id}/join-requests/${memberId}/accept`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }   
    })
  },
  getStudies(page = 0, size = 9, sort = 'id,desc', sortBy = 'new', keyword = '', recruit = '') {
    return apiClient.get(`${domain}`, {
      params: {
        page, size, sort, sortBy, keyword, recruit
      }
    });
  },
  getStudy(id) {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.get(`${domain}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }   
    })
  },
  getMyStudies() {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.get(`${domain}/my`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }   
    })
  },
  getStudyMembers(id) {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.get(`${domain}/${id}/members`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }   
    })
  },
  getRequests(id) {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.get(`${domain}/${id}/join-requests`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }   
    })
  },
  setManager(id) {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.put(`${domain}/${id}/manager`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }   
    })
  },
  updateRecruitmentStatus(id) {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.put(`${domain}/${id}/recruitment`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }   
    })
  },
  setSubManager(id, memberId) {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.put(`${domain}/${id}/sub-manager/${memberId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }   
    })
  },
  unsetSubManager(id) {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.delete(`${domain}/${id}/sub-manager`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }   
    })
  },
  kickMember(id, memberId) {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.delete(`${domain}/${id}/members/${memberId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }   
    })
  },
  declineJoinRequest(id, memberId) {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.delete(`${domain}/${id}/join-requests/${memberId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }   
    })
  },
  leaveStudy(id) {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.delete(`${domain}/${id}/members/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }   
    })
  },
  deleteStudy(id) {
    const authStore = useAuthStore()
    const accessToken = authStore.accessToken

    return apiClient.delete(`${domain}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }   
    })
  },
};