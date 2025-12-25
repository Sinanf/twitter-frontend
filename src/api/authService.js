import axios from 'axios';

const API_URL = 'http://localhost:8080/auth';

export const authService = {
    // Giriş Yapma
    login: (email, password) => {
        return axios.post(`${API_URL}/login`, { email, password });
    },
    // Kayıt Olma
    register: (registerData) => {
        // registerData = { firstName, lastName, email, password }
        return axios.post(`${API_URL}/register`, registerData);
    }
};