const axios = require('axios');

const authServiceClient = {
    register: async (username, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:3000/api/auth/register', { username, password });
            return response.data;
        } catch (error) {
            // Gérer les erreurs
            console.error(error);
            throw error;
        }
    },
    login: async (username, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:3000/api/auth/login', { username, password });
            return response.data;
        } catch (error) {
            // Gérer les erreurs
            console.error(error);
            throw error;
        }
    },
    logout: async () => {
        try {
            const response = await axios.post('http://127.0.0.3000/api/auth/logout');
            return response.data;
        } catch (error) {
            // Gérer les erreurs
            console.error(error);
            throw error;
        }
    },
    verifyToken: async (token) => {
        try {
            const response = await axios.post('http://127.0.0.3000/api/auth/verify', { token });
            return response.data;
        } catch (error) {
            // Gérer les erreurs
            console.error(error);
            throw error;
        }
    }
};



module.exports = authServiceClient;
