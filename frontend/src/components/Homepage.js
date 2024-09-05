// src/components/Homepage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const Homepage = () => {
  const [mode, setMode] = useState('Singleplayer');
  const [difficulty, setDifficulty] = useState('Noob');
  const navigate = useNavigate();

  const startGame = () => {
    navigate('/game', { state: { mode, difficulty } });
  };

  return (
    <div className="homepage-container">
      <h1>Retro Snake Game</h1>
      <div className="start-screen">
        <h2>Press Start 2P</h2>
        <div>
          <label htmlFor="mode" className="dropdown-label">Mode:</label>
          <select
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="dropdown"
          >
            <option value="Singleplayer">Singleplayer</option>
            <option value="Multiplayer">Multiplayer</option>
            <option value="AI">AI</option>
          </select>
        </div>
        <div>
          <label htmlFor="difficulty" className="dropdown-label">Difficulty:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="dropdown"
          >
            <option value="Noob">Noob</option>
            <option value="Wow">Wow</option>
            <option value="God">God</option>
          </select>
        </div>
        <button className="start-button" onClick={startGame}>Start</button>
      </div>
    </div>
  );
};

export default Homepage;
