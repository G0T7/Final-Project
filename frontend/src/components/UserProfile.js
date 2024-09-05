import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as common from './common.js';
import './styles.css';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Token ${token}` }
      };
      try {
        const response = await axios.get(`${common.backend_url}api/user-profile/`, config);
        console.log('API response:', response.data); // Log the entire response data

        // Check if response.data and response.data.user are defined
        if (response.data && response.data.user) {
          setProfile(response.data);
          setUsername(response.data.user.username);
          setEmail(response.data.user.email);
        } else {
          throw new Error('Profile data is not in the expected format.');
        }
      } catch (error) {
        console.error('Fetch profile error:', error.response ? error.response.data : error.message);
        setError('Error fetching profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Token ${token}` }
    };
    try {
      await axios.put(`${common.backend_url}api/user-profile/`, {
        username,
        email,
        password
      }, config);
      setError('');
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error.response ? error.response.data : error.message);
      setError('Error updating profile.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>No profile data available</div>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button onClick={handleUpdate} className="start-button">Update Profile</button>
    </div>
  );
};

export default UserProfile;
