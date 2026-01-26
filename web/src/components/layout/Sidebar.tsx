// web/src/components/layout/Sidebar.tsx
import { Users } from 'lucide-react';

type SidebarProps = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  userRole: 'user' | 'therapist';
};

export default function Sidebar({ currentPage, setCurrentPage, userRole }: SidebarProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Menu</h2>
      <div className="space-y-2">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`w-full text-left px-4 py-2 rounded-lg transition ${
            currentPage === 'dashboard'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          📊 Dashboard
        </button>

        <button
          onClick={() => setCurrentPage('reflections')}
          className={`w-full text-left px-4 py-2 rounded-lg transition ${
            currentPage === 'reflections'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          💭 Reflections
        </button>

        <button
          onClick={() => setCurrentPage('moods')}
          className={`w-full text-left px-4 py-2 rounded-lg transition ${
            currentPage === 'moods'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          😊 Moods
        </button>

        {userRole === 'user' && (
          <button
            onClick={() => setCurrentPage('therapist')}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              currentPage === 'therapist'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            👨‍⚕️ My Therapist
          </button>
        )}

        {userRole === 'therapist' && (
          <button
            onClick={() => setCurrentPage('patients')}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              currentPage === 'patients'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Patients
          </button>
        )}
      </div>
    </div>
  );
}
