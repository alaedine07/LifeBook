// web/src/features/therapist/TherapistPage.tsx
import { useState } from 'react';

export default function TherapistPage() {
  const [therapistEmail, setTherapistEmail] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Therapist</h2>

      {!isAdded ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">
            Add your therapist to share your diary entries with them.
          </p>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Therapist's email"
              value={therapistEmail}
              onChange={(e) => setTherapistEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              onClick={() => setIsAdded(true)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
            >
              Invite Therapist
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl">
              ✓
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Therapist Connected</h3>
              <p className="text-gray-600">{therapistEmail || 'therapist@example.com'}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAdded(false);
              setTherapistEmail('');
            }}
            className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg font-bold hover:bg-red-600 transition"
          >
            Remove Therapist
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          What Your Therapist Can See
        </h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
            All your daily reflections and answers
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
            Your mood logs and notes
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
            Historical data and patterns
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
            Can view any date you choose
          </li>
        </ul>
      </div>
    </div>
  );
}
