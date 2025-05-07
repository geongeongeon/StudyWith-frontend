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
  test(file) {
    return apiClient.post(`${domain}/test`, file, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  validNickname(nickname) {
    return apiClient.get(`${domain}/exists`, {
      params: {nickname}
    });
  }
};