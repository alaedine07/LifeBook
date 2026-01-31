import { useState } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import type { Reflection } from '../../lib/types/types';
import { useUpdateReflection, useDeleteReflection } from '../../hooks/useReflections';
import ReflectionForm from './ReflectionForm';

type ReflectionManagementProps = {
  reflections: Reflection[];
  onCreateReflection: (reflection: Reflection) => void;
  isCreating: boolean;
};

export default function ReflectionManagement({
  reflections,
  onCreateReflection,
  isCreating,
}: ReflectionManagementProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { mutate: updateReflection, isPending: isUpdating } = useUpdateReflection();
  const { mutate: deleteReflection, isPending: isDeleting } = useDeleteReflection();

  const handleEdit = (reflection: Reflection) => {
    setEditingId(reflection.id || null);
    setEditQuestion(reflection.question);
  };

  const handleSaveEdit = (id: number | undefined) => {
    if (id && editQuestion.trim()) {
      updateReflection({ id, question: editQuestion }, {
        onSuccess: () => {
          setEditingId(null);
          setEditQuestion('');
        },
      });
    }
  };

  const handleDelete = (id: number | undefined) => {
    if (id && confirm('Are you sure you want to delete this reflection?')) {
      deleteReflection(id);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditQuestion('');
  };

  const handleAddReflection = (newReflection: Reflection) => {
    onCreateReflection(newReflection);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Create New Reflection Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            disabled={isCreating}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Create New Reflection
          </button>
        ) : (
          <ReflectionForm
            onCancel={() => setShowForm(false)}
            onSave={handleAddReflection}
            isLoading={isCreating}
          />
        )}
      </div>

      {/* Reflections List Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">My Reflections</h3>

      {reflections.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No reflections created yet. Create one to get started!</p>
      ) : (
        <div className="space-y-3">
          {reflections.map((reflection) => (
            <div key={reflection.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition">
              {editingId === reflection.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={editQuestion}
                    onChange={(e) => setEditQuestion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(reflection.id)}
                      disabled={isUpdating}
                      className="px-4 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-1 bg-gray-400 text-white rounded-lg text-sm hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{reflection.question}</p>
                    <p className="text-sm text-gray-500">Type: {reflection.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(reflection)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(reflection.id)}
                      disabled={isDeleting}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
