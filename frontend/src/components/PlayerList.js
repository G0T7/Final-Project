// src/components/PlayerList.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './styles.css';

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/players/')
      .then(response => {
        setPlayers(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching players');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Player List</h1>
      <ul>
        {players.map(player => (
          <li key={player.id}>{player.username} - {player.score}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
