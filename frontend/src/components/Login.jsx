// components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In a real app, you would make an API call to your backend
      // For demo purposes, we'll simulate admin/user login
      
      // Uncomment for real backend integration
      /*
      const response = await axios.post('/api/auth/login', {
        username,
        password
      });
      const userData = response.data;
      */
      
      // Demo login logic - remove in production
      let userData;
      if (username === 'admin' && password === 'admin123') {
        userData = {
          id: 1,
          username: 'admin',
          isAdmin: true
        };
      } else if (username === 'user' && password === 'user123') {
        userData = {
          id: 2,
          username: 'user',
          isAdmin: false
        };
      } else {
        throw new Error('Invalid credentials');
      }
      
      onLogin(userData);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="demo-credentials">
        <p><strong>Demo Credentials:</strong></p>
        <p>Admin: username: "admin", password: "admin123"</p>
        <p>User: username: "user", password: "user123"</p>
      </div>
    </div>
  );
}

export default Login;