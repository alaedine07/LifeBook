// web/src/components/layout/Sidebar.tsx
import { Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

type SidebarProps = {
  userRole: 'user' | 'therapist';
};

export default function Sidebar({ userRole }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Menu</h2>
      <div className="space-y-2">
        <button
          onClick={() => navigate('/dashboard')}
          className={`w-full text-left px-4 py-2 rounded-lg transition ${
            isActive('/dashboard')
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          📊 Dashboard
        </button>

        <button
          onClick={() => navigate('/reflections')}
          className={`w-full text-left px-4 py-2 rounded-lg transition ${
            isActive('/reflections')
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          💭 Reflections
        </button>

        <button
          onClick={() => navigate('/moods')}
          className={`w-full text-left px-4 py-2 rounded-lg transition ${
            isActive('/moods')
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          😊 Moods
        </button>

        {userRole === 'user' && (
          <button
            onClick={() => navigate('/therapist')}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              isActive('/therapist')
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            👨‍⚕️ My Therapist
          </button>
        )}

        {userRole === 'therapist' && (
          <button
            onClick={() => navigate('/patients')}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              isActive('/patients')
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
