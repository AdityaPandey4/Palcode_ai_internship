// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';

// Components for leave request system
const LeaveRequestForm = React.lazy(() => import('./components/LeaveRequestForm'));
const AdminLeaveRequests = React.lazy(() => import('./components/AdminLeaveRequests'));
const Login = React.lazy(() => import('./components/Login'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  // Simple login handler
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setIsAdmin(userData.isAdmin);
    setUser(userData);
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Leave Approval System</h1>
          <nav>
            <ul className="nav-links">
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/request">Request Leave</Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link to="/admin">Admin Dashboard</Link>
                    </li>
                  )}
                  <li>
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout ({user?.username})
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login">Login</Link>
                </li>
              )}
            </ul>
          </nav>
        </header>

        <main className="app-content">
          <React.Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? 
                    <Navigate to="/request" /> : 
                    <Login onLogin={handleLogin} />
                } 
              />
              <Route 
                path="/request" 
                element={
                  isAuthenticated ? 
                    <LeaveRequestForm userId={user?.id} /> : 
                    <Navigate to="/login" />
                } 
              />
              <Route 
                path="/admin" 
                element={
                  isAuthenticated && isAdmin ? 
                    <AdminLeaveRequests /> : 
                    <Navigate to={isAuthenticated ? "/request" : "/login"} />
                } 
              />
              <Route 
                path="/" 
                element={
                  isAuthenticated ? 
                    <Navigate to="/request" /> : 
                    <Navigate to="/login" />
                } 
              />
            </Routes>
          </React.Suspense>
        </main>

        <footer className="app-footer">
          <p>&copy; 2025 Leave Approval System</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;