// src/features/reflections/ReflectionForm.tsx
import { useState } from 'react';
import type { Reflection } from '../../lib/types/types';

type ReflectionFormProps = {
  onCancel: () => void;
  onSave: (newReflection: Reflection) => void;
  isLoading?: boolean;
};

export default function ReflectionForm({ onCancel, onSave, isLoading = false }: ReflectionFormProps) {
  const [newReflection, setNewReflection] = useState('');
  const [reflectionType, setReflectionType] = useState<'TEXT' | 'BOOLEAN' | 'NUMBER'>('TEXT');

  const handleSave = () => {
    if (newReflection.trim()) {
      onSave({
        question: newReflection,
        type: reflectionType,
        answer: '',
      });
      setNewReflection('');
      setReflectionType('TEXT');
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Your reflection question..."
        value={newReflection}
        onChange={(e) => setNewReflection(e.target.value)}
        disabled={isLoading}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />

      <select
        value={reflectionType}
        onChange={(e) =>
          setReflectionType(e.target.value as 'TEXT' | 'BOOLEAN' | 'NUMBER')
        }
        disabled={isLoading}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="TEXT">Text Response</option>
        <option value="BOOLEAN">Yes/No</option>
        <option value="NUMBER">Number (Scale)</option>
      </select>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Reflection'}
        </button>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
