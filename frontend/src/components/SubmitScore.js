// src/components/SubmitScore.js

// src/components/SubmitScore.js

import axios from 'axios';
import './styles.css';
import * as common from './common.js';
import React, { useState } from 'react';

const SubmitScoreForm = () => {
  const [username, setUsername] = useState('');
  const [score, setScore] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    const ctx = {
      username: username,
      score: score
    };

    const url = common.backend_url + 'api/submit-score/';
    
    const config = {
      headers: { Authorization: `Token ${token}` }
    };

    axios.post(url, ctx, config)
      .then(response => {
        console.log('Score submission successful:', response.data);
        setMessage('Score submitted successfully!');
      })
      .catch(error => {
        console.log(error);
        setError(error.response.data.error);
      });
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Submit Score</h2>
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
        Score:
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          required
        />
      </label>
      <button type="submit" className="start-button">Submit Score</button>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
    </form>
  );
};

export default SubmitScoreForm;
