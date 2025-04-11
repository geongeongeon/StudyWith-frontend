import apiClient from "./api-client";

const domain = "connection";

export default {
  testConnection() {
      return apiClient.get(`${domain}/test`);
  },
};