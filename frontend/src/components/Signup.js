// src/components/Signup.js

import axios from 'axios';
import './styles.css';
import * as common from './common.js';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (event) => {
    event.preventDefault();
    const ctx = {
      username: username,
      password: password,
      email: email
    };

    const url = common.backend_url + 'api/signup/';
    
    axios.post(url, ctx)
      .then(response => {
        console.log('Signup successful:', response.data);
        setMessage('Signup successful! You can now log in.');
        // Redirect to the login page after successful signup
        setTimeout(() => navigate('/login'), 2000); // Optional delay for message display
      })
      .catch(error => {
        console.log(error);
        setError(error.response.data.error);
      });
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
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
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <button type="submit" className="start-button">Sign Up</button>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
    </form>
  );
};

export default SignupForm;
