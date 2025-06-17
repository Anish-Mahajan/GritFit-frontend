import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const ProgressChart = () => {
  const [durationData, setDurationData] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);

  useEffect(() => {
    api.get('/workouts')
      .then(res => {
        const workouts = res.data;

        const groupedDuration = {};
        const groupedExercises = {};

        workouts.forEach(workout => {
          const date = new Date(workout.date).toLocaleDateString();
          const duration = workout.duration || 0;
          const exerciseCount = workout.exercises.length;

          groupedDuration[date] = (groupedDuration[date] || 0) + duration;
          groupedExercises[date] = (groupedExercises[date] || 0) + exerciseCount;
        });

        const durationArr = Object.entries(groupedDuration).map(([date, duration]) => ({
          date,
          duration
        })).sort((a, b) => new Date(a.date) - new Date(b.date));

        const exerciseArr = Object.entries(groupedExercises).map(([date, count]) => ({
          date,
          count
        })).sort((a, b) => new Date(a.date) - new Date(b.date));

        setDurationData(durationArr);
        setExerciseData(exerciseArr);
      })
      .catch(err => console.error('Chart data fetch failed', err));
  }, []);

  return (
    <div className="my-4">
      {/* Workout Duration Chart */}
      <div className="card p-4 mb-4">
        <h4 className="mb-3">Workout Duration Over Time (minutes)</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={durationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="duration" stroke="#28a745" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Exercise Count Chart */}
      <div className="card p-4">
        <h4 className="mb-3">Number of Exercises Per Day</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={exerciseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ffc107" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
