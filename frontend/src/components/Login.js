import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { backend_url } from './commonBackend';
import './styles.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const ctx = {
      username: username,
      password: password
    };

    const url = `${backend_url}/api/login/`;

    axios.post(url, ctx)
      .then(response => {
        console.log('Login successful:', response.data);
        setMessage('Login successful!');
        localStorage.setItem('token', response.data.token);
        setIsLoggedIn(true);
        setTimeout(() => navigate('/'), 2000); // Optional delay for message display
      })
      .catch(error => {
        console.log(error);
        setError(error.response?.data?.error || 'Login failed. Please try again.');
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="form-container">
      {isLoggedIn ? (
        <div>
          <h2>Already Logged In</h2>
          <button onClick={handleLogout} className="start-button">Logout</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
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
        </form>
      )}
    </div>
  );
};

export default LoginForm;
