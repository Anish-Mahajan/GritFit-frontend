// ✅ All pages upgraded with Bootstrap styling including WorkoutHistory.js

import React, { useState, useEffect } from 'react';
import ProgressChart from './ProgressChart';
import { api } from '../services/api';



const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await api.get('/workouts');
      setWorkouts(response.data);
    } catch (err) {
      console.error('Failed to fetch workout history', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (id) => {
    try {
      await api.delete(`/workouts/${id}`);
      setWorkouts(workouts.filter(w => w._id !== id));
    } catch (err) {
      console.error('Failed to delete workout', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div className="text-center py-5 text-muted">Loading workout history...</div>;

  return (
    <div className="container py-4">
      <h2 className="text-primary mb-4">Workout History</h2>
      <ProgressChart />

      {workouts.length === 0 ? (
        <div className="alert alert-info">No workouts found. Start logging your workouts!</div>
      ) : (
        workouts.map(workout => (
          <div key={workout._id} className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">{formatDate(workout.date)}</h5>
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteWorkout(workout._id)}>
                  Delete
                </button>
              </div>
              <p className="text-muted mb-2">Duration: {workout.duration || 0} min</p>
              <ul className="list-group list-group-flush mb-3">
                {workout.exercises.map((exercise, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between">
                    <span>{exercise.name}</span>
                    <small className="text-muted">{exercise.sets}×{exercise.reps} @ {exercise.weight}lbs</small>
                  </li>
                ))}
              </ul>
              {workout.notes && <div className="fst-italic text-muted">"{workout.notes}"</div>}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default WorkoutHistory;
