// ✅ App.js, Login.js, Register.js, Dashboard.js, and WorkoutForm.js upgraded with Bootstrap styling

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const WorkoutForm = () => {
  const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '', weight: '' }]);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', weight: '' }]);
  };

  const removeExercise = (index) => {
    const updated = exercises.filter((_, i) => i !== index);
    setExercises(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/workouts', {
        exercises,
        duration: parseInt(duration),
        notes
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to log workout', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-primary">Log a New Workout</h2>
      <form onSubmit={handleSubmit}>
        {exercises.map((exercise, index) => (
          <div key={index} className="card p-3 mb-3">
            <div className="row g-2">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Exercise Name"
                  value={exercise.name}
                  onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Sets"
                  value={exercise.sets}
                  onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Reps"
                  value={exercise.reps}
                  onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Weight (lbs)"
                  value={exercise.weight}
                  onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                  required
                />
              </div>
              <div className="col-md-2 text-end">
                {exercises.length > 1 && (
                  <button type="button" className="btn btn-danger w-100" onClick={() => removeExercise(index)}>
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="mb-3">
          <button type="button" className="btn btn-outline-primary" onClick={addExercise}>
            + Add Another Exercise
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label">Workout Duration (minutes)</label>
          <input
            type="number"
            className="form-control"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Notes (optional)</label>
          <textarea
            className="form-control"
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? 'Logging...' : 'Log Workout'}
        </button>
      </form>
    </div>
  );
};

export default WorkoutForm;
  