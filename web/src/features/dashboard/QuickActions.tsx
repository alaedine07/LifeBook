// web/src/features/dashboard/QuickActions.tsx
import { Plus, Heart } from 'lucide-react';

export default function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Answer Reflections
        </button>
        <button className="bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition flex items-center justify-center gap-2">
          <Heart className="w-5 h-5" />
          Log Mood
        </button>
      </div>
    </div>
  );
}
