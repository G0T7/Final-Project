// src/utils/auth.js
import axios from 'axios';

const login = async (username, password) => {
    try {
        const response = await axios.post('https://retro-mini-snake-game.onrender.com/api/login/', {
            username,
            password
        });
        const token = response.data.token;
        localStorage.setItem('token', token);
        console.log('Token stored:', token);
    } catch (error) {
        console.error('Error logging in:', error.response ? error.response.data : error.message);
    }
};

export default login;
