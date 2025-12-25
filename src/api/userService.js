import axios from 'axios';

const API_URL = 'http://localhost:8080/user';

export const userService = {
    // Kullanıcı Arama
    searchUsers: (query, authConfig) => {
        return axios.get(`${API_URL}/search?query=${query}`, authConfig);
    }
};