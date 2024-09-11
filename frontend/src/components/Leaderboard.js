import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Token ${token}` }
      };
      console.log('Config:', config);
      try {
        console.log('Fetching leaderboard...');
        const response = await axios.get('https://retro-mini-snake-game.onrender.com/api/leaderboard/', config);
        console.log('API response:', response);
        setLeaderboard(response?.data || []);
      } catch (error) {
        setError('Error fetching leaderboard');
        console.error('Error fetching leaderboard:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.player.username || 'Unknown'}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
