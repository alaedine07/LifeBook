// src/App.tsx
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
  { id: 1, question: 'How was your mood today?', type: 'yes_no', answer: true },
  { id: 2, question: 'Rate your anxiety level (1-10)', type: 'number', answer: 7 },
  { id: 3, question: 'What made you happy today?', type: 'text', answer: 'Spending time with friends' },
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


const pageComponents: Record<string, React.ComponentType<any>> = {
  dashboard: DashboardPage,
  reflections: ReflectionsPage,
  moods: MoodsPage,
  therapist: TherapistPage,
  patients: PatientsPage,
};

// ────────────────────────────────────────────────
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userRole] = useState<'user' | 'therapist'>('user'); // can be 'therapist'
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  if (!isAuthenticated) {
    return <LoginPage setIsAuthenticated={setIsAuthenticated} />;
  }

  const PageComponent = pageComponents[currentPage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar onLogout={() => setIsAuthenticated(false)} />
      <AppLayout>
        <div className="col-span-3">
          <Sidebar
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            userRole={userRole}
          />
        </div>
        <div className="col-span-9">
          <PageComponent
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            {...(currentPage === 'dashboard' || currentPage === 'reflections'
              ? { reflections: initialReflections }
              : {})}
            {...(currentPage === 'dashboard' || currentPage === 'moods'
              ? { moods: initialMoods, moodEmojis }
              : {})}
            {...(currentPage === 'patients' ? { patients: initialPatients } : {})}
          />
        </div>
      </AppLayout>
    </div>
  );
}
