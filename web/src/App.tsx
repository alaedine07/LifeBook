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

  const isAuth = useAuthStore((s) => s.isAuthenticated());

  return (
    <Routes>
      <Route path="/" element={isAuth ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {isAuth ? (
        <>
          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <DashboardPage />
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
                <PatientsPage />
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
