// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import AppLayout from './components/layout/AppLayout';

import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import ReflectionsPage from './features/reflections/ReflectionsPage';
import MoodsPage from './features/moods/MoodsPage';
import TherapistPage from './features/therapist/TherapistPage';
import PatientsPage from './features/patients/PatientsPage';
import SignupPage from './features/auth/SignupPage';

import { useAuthStore } from './stores/authStore';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { role } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <AppLayout>
        <div className="col-span-3">
          <Sidebar userRole={role?.toLowerCase() as 'user' | 'therapist'} />
        </div>
        <div className="col-span-9">{children}</div>
      </AppLayout>
    </div>
  );
}

export default function App() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const { isAuthenticated } = useAuthStore();

  const moodEmojis: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    neutral: '😐',
    extremely_happy: '🤩',
    extremely_sad: '😭',
    anxious: '😰',
    tired: '😴',
  };

  const initialReflections = [
    { id: 1, question: 'How was your mood today?', type: 'yes_no' as const, answer: true },
    { id: 2, question: 'Rate your anxiety level (1-10)', type: 'number' as const, answer: 7 },
    { id: 3, question: 'What made you happy today?', type: 'text' as const, answer: 'Spending time with friends' },
  ];

  const initialMoods = [
    { id: 1, type: 'happy', notes: 'Had a great day at work', date: '2024-01-26' },
    { id: 2, type: 'anxious', notes: 'Worried about upcoming meeting', date: '2024-01-25' },
    { id: 3, type: 'neutral', notes: '', date: '2024-01-24' },
  ];

  const initialPatients = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {isAuthenticated ? (
        <>
          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <DashboardPage
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  reflections={initialReflections}
                  moods={initialMoods}
                  moodEmojis={moodEmojis}
                />
              </ProtectedLayout>
            }
          />
          <Route
            path="/reflections"
            element={
              <ProtectedLayout>
                <ReflectionsPage
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  reflections={initialReflections}
                />
              </ProtectedLayout>
            }
          />
          <Route
            path="/moods"
            element={
              <ProtectedLayout>
                <MoodsPage
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  moods={initialMoods}
                  moodEmojis={moodEmojis}
                />
              </ProtectedLayout>
            }
          />
          <Route
            path="/therapist"
            element={
              <ProtectedLayout>
                <TherapistPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedLayout>
                <PatientsPage patients={initialPatients} />
              </ProtectedLayout>
            }
          />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}
