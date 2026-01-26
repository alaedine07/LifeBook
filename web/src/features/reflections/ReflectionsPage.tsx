// web/src/features/reflections/ReflectionsPage.tsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import ReflectionCard from './ReflectionCard';
import ReflectionForm from './ReflectionForm';
import type { Reflection } from '../../lib/types/types';

type ReflectionsPageProps = {
  reflections: Reflection[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
};

export default function ReflectionsPage({
  reflections,
  selectedDate,
  setSelectedDate,
}: ReflectionsPageProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header with Date */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Daily Reflections</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      {/* Add New Reflection Button / Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Reflection
          </button>
        ) : (
          <ReflectionForm onCancel={() => setShowForm(false)} />
        )}
      </div>

      {/* Reflections List */}
      <div className="space-y-4">
        {reflections.map((reflection) => (
          <ReflectionCard key={reflection.id} reflection={reflection} />
        ))}
      </div>
    </div>
  );
}
