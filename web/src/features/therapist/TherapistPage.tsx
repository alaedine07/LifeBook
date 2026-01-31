// web/src/features/therapist/TherapistPage.tsx
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useAddTherapist, useDeleteTherapist, useFetchTherapists } from '../../hooks/useTherapists';

export default function TherapistPage() {
  const [therapistEmail, setTherapistEmail] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const { data: therapists = [], isLoading } = useFetchTherapists();
  const { mutate: addTherapist, isPending: isAddingTherapist } = useAddTherapist();
  const { mutate: deleteTherapist, isPending: isDeletingTherapist } = useDeleteTherapist();

  const handleAddTherapist = () => {
    if (!therapistEmail.trim()) return;
    addTherapist(therapistEmail, {
      onSuccess: () => {
        setTherapistEmail('');
      },
    });
  };

  const handleDeleteTherapist = (therapistId: number) => {
    deleteTherapist(therapistId, {
      onSuccess: () => {
        setDeleteConfirm(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Therapists</h2>

      {/* Add Therapist Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add a Therapist</h3>
        <p className="text-gray-600 mb-4">
          Add your therapist's email to share your diary entries with them.
        </p>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Therapist's email"
            value={therapistEmail}
            onChange={(e) => setTherapistEmail(e.target.value)}
            disabled={isAddingTherapist}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-100"
          />
          <button
            onClick={handleAddTherapist}
            disabled={isAddingTherapist || !therapistEmail.trim()}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isAddingTherapist ? 'Adding...' : 'Invite Therapist'}
          </button>
        </div>
      </div>

      {/* Therapists List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Therapists</h3>
        {isLoading ? (
          <p className="text-gray-600">Loading therapists...</p>
        ) : therapists.length === 0 ? (
          <p className="text-gray-600">No therapists added yet.</p>
        ) : (
          <div className="space-y-3">
            {therapists.map((link: any) => (
              <div
                key={link.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar Placeholder */}
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {link.therapist.username.charAt(0).toUpperCase()}
                  </div>

                  {/* Therapist Info */}
                  <div>
                    <p className="font-semibold text-gray-800">{link.therapist.username}</p>
                    <p className="text-sm text-gray-600">{link.therapist.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Connected since {new Date(link.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  {deleteConfirm === link.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteTherapist(link.id)}
                        disabled={isDeletingTherapist}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        disabled={isDeletingTherapist}
                        className="px-3 py-1 bg-gray-300 text-gray-800 text-sm rounded-lg font-semibold hover:bg-gray-400 transition disabled:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(link.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Remove therapist"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">What Your Therapist Can See</h3>
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
            Can view any date they choose
          </li>
        </ul>
      </div>
    </div>
  );
}
