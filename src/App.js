// ✅ App.js upgraded with Bootstrap navbar and layout

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import WorkoutForm from './components/WorkoutForm';
import WorkoutHistory from './components/WorkoutHistory';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, logout } = useAuth();

  return (
    <div className="min-vh-100 bg-light">
      {user && (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
          <div className="container-fluid d-flex justify-content-between">
            <span className="navbar-brand fw-bold text-primary"> GritFit ❚█══█❚ </span>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted small">Welcome, {user.name}</span>
              <button onClick={logout} className="btn btn-outline-secondary btn-sm">Logout</button>
            </div>
          </div>
        </nav>
      )}

      <main className="container py-4">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/workout/new" element={user ? <WorkoutForm /> : <Navigate to="/login" />} />
          <Route path="/workouts" element={user ? <WorkoutHistory /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
