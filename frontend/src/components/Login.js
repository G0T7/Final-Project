// src/components/Login.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import * as common from './common.js';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setMessage('You are currently logged in.');
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post(common.backend_url + 'api/login/', { username, password })
      .then(response => {
        localStorage.setItem('token', response.data.token);
        console.log('Login successful:', response.data);
        setMessage('Login successful! Redirecting to home page...');
        window.location.href = '/';
      })
      .catch(error => {
        setError(error.response.data.error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setMessage('You have logged out.');
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit" className="start-button">Login</button>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      {localStorage.getItem('token') && <button onClick={handleLogout} className="start-button">Logout</button>}
    </form>
  );
};

export default LoginForm;
