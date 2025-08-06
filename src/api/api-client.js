import axios from 'axios';

const apiClient = axios.create({
    baseURL: "http://api.studywith.site:8080",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default apiClient;