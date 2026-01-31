// web/src/features/reflections/ReflectionsPage.tsx
import { useState } from 'react';
import ReflectionCard from './ReflectionCard';
import ReflectionManagement from './ReflectionManagement';
import type { Reflection } from '../../lib/types/types';
import { useCreateReflection, useFetchReflections } from '../../hooks/useReflections';

type ReflectionsPageProps = {
  reflections?: Reflection[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
};

export default function ReflectionsPage({
  selectedDate,
  setSelectedDate,
}: ReflectionsPageProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'manage'>('daily');
  const { mutate: createReflection, isPending: isCreating } = useCreateReflection();
  const { data: serverReflections, isLoading } = useFetchReflections();

  const displayReflections = serverReflections || [];

  const handleAddReflection = (newReflection: Reflection) => {
    createReflection(newReflection);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('daily')}
          className={`pb-3 px-4 font-medium transition ${
            activeTab === 'daily'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Daily Reflections
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`pb-3 px-4 font-medium transition ${
            activeTab === 'manage'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Manage Reflections
        </button>
      </div>

      {/* Daily Reflections Tab */}
      {activeTab === 'daily' && (
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

          {/* Loading State */}
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
                <p className="text-gray-600 mt-4">Loading your reflections...</p>
              </div>
            </div>
          ) : (
            /* Reflections List */
            <div className="space-y-4">
              {displayReflections.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-gray-500">No reflections available. Create one in the Manage tab to get started!</p>
                </div>
              ) : (
                (displayReflections as Reflection[]).map((reflection) => (
                  <ReflectionCard key={reflection.id} reflection={reflection} selectedDate={selectedDate} />
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Manage Reflections Tab */}
      {activeTab === 'manage' && (
        <div>
          <ReflectionManagement
            reflections={displayReflections as Reflection[]}
            onCreateReflection={handleAddReflection}
            isCreating={isCreating}
          />
        </div>
      )}
    </div>
  );
}
