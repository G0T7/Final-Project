

// src/components/Game.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles.css';

// Function to draw the snake on the canvas
const drawSnake = (ctx, snake, color) => {
  ctx.fillStyle = color;
  snake.forEach(part => {
    ctx.fillRect(part.x * 20, part.y * 20, 20, 20);
  });
};

// Function to draw the food on the canvas
const drawFood = (ctx, food) => {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
};

// Function to move the snake in the specified direction
const moveSnake = (snake, direction) => {
  const head = { ...snake[0] };
  switch (direction) {
    case 'RIGHT': head.x += 1; break;
    case 'LEFT': head.x -= 1; break;
    case 'UP': head.y -= 1; break;
    case 'DOWN': head.y += 1; break;
    default: break;
  }

  // Check for border collision
  if (head.x >= 30 || head.x < 0 || head.y >= 30 || head.y < 0) {
    return null;
  }

  return [head, ...snake.slice(0, -1)];
};

// Function to determine the AI snake's direction towards the food
const getAISnakeDirection = (aiSnake, food) => {
  const head = aiSnake[0];
  if (head.x < food.x) return 'RIGHT';
  if (head.x > food.x) return 'LEFT';
  if (head.y < food.y) return 'DOWN';
  if (head.y > food.y) return 'UP';
  return 'RIGHT';
};

// Function to check for collisions between two snakes
const checkCollision = (snake1, snake2) => {
  const head1 = snake1[0];
  return snake2.some(part => part.x === head1.x && part.y === head1.y);
};

const Game = () => {
  const location = useLocation();
  const { mode, difficulty } = location.state || { mode: 'Singleplayer', difficulty: 'Noob' };
  const [gameState, setGameState] = useState('PLAYING');
  const [direction, setDirection] = useState('RIGHT');
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [aiSnake, setAISnake] = useState([{ x: 20, y: 20 }]);
  const [aiDirection, setAIDirection] = useState('LEFT');
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [isGrowing, setIsGrowing] = useState(false);
  const [aiIsGrowing, setAIIsGrowing] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAIScore] = useState(0);
  const [player2Direction, setPlayer2Direction] = useState('LEFT');
  const [player2Snake, setPlayer2Snake] = useState([{ x: 25, y: 25 }]);
  const [player2IsGrowing, setPlayer2IsGrowing] = useState(false);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Function to get the game speed based on the selected difficulty
  const getSpeed = useCallback(() => {
    switch (difficulty) {
      case 'Noob': return 200;
      case 'Wow': return 150;
      case 'God': return 100;
      default: return 200;
    }
  }, [difficulty]);

  // Function to reset the game state
  const resetGame = useCallback(() => {
    setDirection('RIGHT');
    setAIDirection('LEFT');
    setSnake([{ x: 10, y: 10 }]);
    setAISnake([{ x: 20, y: 20 }]);
    setFood({ x: 15, y: 15 });
    setIsGrowing(false);
    setAIIsGrowing(false);
    setPlayerScore(0);
    setAIScore(0);
    setPlayer2Direction('LEFT');
    setPlayer2Snake([{ x: 25, y: 25 }]);
    setPlayer2IsGrowing(false);
    setGameState('PLAYING');
  }, []);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Function to handle key presses for controlling the snakes
      const handleKeyPress = (event) => {
        if (event.key === 'ArrowRight' && direction !== 'LEFT') setDirection('RIGHT');
        if (event.key === 'ArrowLeft' && direction !== 'RIGHT') setDirection('LEFT');
        if (event.key === 'ArrowUp' && direction !== 'DOWN') setDirection('UP');
        if (event.key === 'ArrowDown' && direction !== 'UP') setDirection('DOWN');
        if (event.key === 'd' && player2Direction !== 'LEFT') setPlayer2Direction('RIGHT');
        if (event.key === 'a' && player2Direction !== 'RIGHT') setPlayer2Direction('LEFT');
        if (event.key === 'w' && player2Direction !== 'DOWN') setPlayer2Direction('UP');
        if (event.key === 's' && player2Direction !== 'UP') setPlayer2Direction('DOWN');
      };

      document.addEventListener('keydown', handleKeyPress);

      const interval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw and update the player snake
        drawSnake(ctx, snake, 'lime');
        setSnake(prevSnake => {
          const newSnake = moveSnake(prevSnake, direction);
          if (!newSnake) {
            setGameState('GAME_OVER');
            return prevSnake;
          }

          const head = newSnake[0];
          if (head.x === food.x && head.y === food.y) {
            setFood({ x: Math.floor(Math.random() * 30), y: Math.floor(Math.random() * 30) });
            setIsGrowing(true);
            setPlayerScore(prevScore => prevScore + 1); // Increment score by 1
          }

          if (isGrowing) {
            newSnake.unshift(head);
            setIsGrowing(false);
          }

          return newSnake;
        });

        // Draw and update the AI snake
        if (mode === 'AI') {
          setAIDirection(getAISnakeDirection(aiSnake, food));
          drawSnake(ctx, aiSnake, 'blue');
          setAISnake(prevAISnake => {
            const newAISnake = moveSnake(prevAISnake, aiDirection);
            if (!newAISnake) {
              setGameState('GAME_OVER');
              return prevAISnake;
            }

            const head = newAISnake[0];
            if (head.x === food.x && head.y === food.y) {
              setFood({ x: Math.floor(Math.random() * 30), y: Math.floor(Math.random() * 30) });
              setAIIsGrowing(true);
              setAIScore(prevScore => prevScore + 1); // Increment AI score by 1
            }

            if (aiIsGrowing) {
              newAISnake.unshift(head);
              setAIIsGrowing(false);
            }

            return newAISnake;
          });
        }

        // Draw and update the player 2 snake
        if (mode === 'Multiplayer') {
          drawSnake(ctx, player2Snake, 'orange');
          setPlayer2Snake(prevPlayer2Snake => {
            const newPlayer2Snake = moveSnake(prevPlayer2Snake, player2Direction);
            if (!newPlayer2Snake) {
              setGameState('GAME_OVER');
              return prevPlayer2Snake;
            }

            const head = newPlayer2Snake[0];
            if (head.x === food.x && head.y === food.y) {
              setFood({ x: Math.floor(Math.random() * 30), y: Math.floor(Math.random() * 30) });
              setPlayer2IsGrowing(true);
              setPlayerScore(prevScore => prevScore + 1); // Increment player 2 score by 1
            }

            if (player2IsGrowing) {
              newPlayer2Snake.unshift(head);
              setPlayer2IsGrowing(false);
            }

            return newPlayer2Snake;
          });
        }

        // Check for collisions between snakes
        if (checkCollision(snake, aiSnake) || checkCollision(aiSnake, snake) || checkCollision(snake, player2Snake) || checkCollision(player2Snake, snake)) {
          setGameState('GAME_OVER');
        }

        drawFood(ctx, food);
      }, getSpeed());

      return () => {
        clearInterval(interval);
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [gameState, direction, aiDirection, player2Direction, snake, aiSnake, player2Snake, food, isGrowing, aiIsGrowing, player2IsGrowing, getSpeed, mode]);

  // Function to handle quitting the game
  const quitGame = () => {
    console.log("Quitting the game...");
    navigate('/'); // Navigates back to the home page (lobby)
  };

  return (
    <div className={`game-container ${gameState === 'GAME_OVER' ? 'game-over' : ''}`}>
      <div className="canvas-container">
        <canvas ref={canvasRef} width="600" height="600" />
        <div>
          <div className="scoreboard">
            <h2>Scoreboard</h2>
            <p>Player Score: {playerScore}</p>
            {mode === 'Multiplayer' && <p>Player 2 Score: {playerScore}</p>}
            {mode === 'AI' && <p>AI Score: {aiScore}</p>}
          </div>
          <div className="guide-box">
            <h2>Guide</h2>
            <p>Singleplayer: Arrow Keys</p>
            <p>Player Snake: Lime</p>
            <p>Food: Red</p>
            <p>Multiplayer: Player 1 - Arrow Keys</p>
            <p>Player 2 (Orange) - WASD</p>
            <p>AI (Blue) - Self Control</p>
          </div>
        </div>
        {gameState === 'GAME_OVER' && (
          <div className="game-over-screen">
            <h1>Game Over</h1>
            <p>Score: {playerScore}</p>
            {mode === 'AI' && <p className="score">AI Score: {aiScore}</p>}
            <button className="restart-button" onClick={resetGame}>Restart</button>
          </div>
        )}
      </div>
      <button className="quit-button" onClick={quitGame}>Quit</button>
    </div>
  );
};

export default Game;