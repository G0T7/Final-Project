// src/components/PlayerForm.js
import React, { useState } from 'react';
import api from '../services/api';
import './styles.css';

const PlayerForm = ({ onPlayerAdded }) => {
  const [username, setUsername] = useState('');
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    api.post('/players/', { username, score })
      .then(response => {
        console.log('Player added:', response.data);
        setUsername('');
        setScore('');
        setError('');
        onPlayerAdded();  // Refresh the player list
      })
      .catch(error => {
        setError('Failed to add player');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Score:</label>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Player'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default PlayerForm;
