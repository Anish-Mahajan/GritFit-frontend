// ✅ App.js, Login.js, Register.js, and Dashboard.js upgraded with Bootstrap styling

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const Dashboard = () => {
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalExercises: 0,
    avgDuration: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [recentResponse, allWorkoutsResponse] = await Promise.all([
        api.get('/workouts/recent'),
        api.get('/workouts')
      ]);

      setRecentWorkouts(recentResponse.data);

      const workouts = allWorkoutsResponse.data;
      const totalWorkouts = workouts.length;
      const totalExercises = workouts.reduce((sum, workout) => sum + workout.exercises.length, 0);
      const avgDuration = totalWorkouts > 0
        ? Math.round(workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0) / totalWorkouts)
        : 0;

      setStats({ totalWorkouts, totalExercises, avgDuration });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div className="text-center py-5 text-muted">Loading dashboard...</div>;

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Dashboard</h1>
        <div className="d-flex gap-2">
          <Link to="/workout/new" className="btn btn-primary">Log New Workout</Link>
          <Link to="/workouts" className="btn btn-outline-secondary">View All Workouts</Link>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card text-center p-3">
            <h4 className="text-primary">{stats.totalWorkouts}</h4>
            <p>Total Workouts</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center p-3">
            <h4 className="text-success">{stats.totalExercises}</h4>
            <p>Total Exercises</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center p-3">
            <h4 className="text-info">{stats.avgDuration} min</h4>
            <p>Avg Duration</p>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3>Recent Workouts</h3>
        {recentWorkouts.length === 0 ? (
          <div className="text-center text-muted mt-4">
            <p>No workouts yet. Log your first one!</p>
            <Link to="/workout/new" className="btn btn-primary">Log Workout</Link>
          </div>
        ) : (
          <div className="mt-3">
            {recentWorkouts.map(workout => (
              <div key={workout._id} className="border-bottom pb-3 mb-3">
                <div className="d-flex justify-content-between">
                  <h5 className="text-dark mb-1">{formatDate(workout.date)}</h5>
                  <small className="text-muted">{workout.duration || 0} min</small>
                </div>
                <ul className="list-unstyled mb-2">
                  {workout.exercises.map((exercise, i) => (
                    <li key={i} className="d-flex justify-content-between">
                      <span>{exercise.name}</span>
                      <small className="text-muted">{exercise.sets}×{exercise.reps} @ {exercise.weight}lbs</small>
                    </li>
                  ))}
                </ul>
                {workout.notes && (
                  <div className="fst-italic text-muted">"{workout.notes}"</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
