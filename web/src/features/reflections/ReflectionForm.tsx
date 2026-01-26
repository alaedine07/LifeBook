// src/features/reflections/ReflectionForm.tsx
import { useState } from 'react';

type ReflectionFormProps = {
  onCancel: () => void;
  // onSave?: (newReflection: { question: string; type: string }) => void;  // ← add later when you have real save
};

export default function ReflectionForm({ onCancel }: ReflectionFormProps) {
  const [newReflection, setNewReflection] = useState('');
  const [reflectionType, setReflectionType] = useState<'text' | 'yes_no' | 'number'>('text');

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Your reflection question..."
        value={newReflection}
        onChange={(e) => setNewReflection(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
      />

      <select
        value={reflectionType}
        onChange={(e) =>
          setReflectionType(e.target.value as 'text' | 'yes_no' | 'number')
        }
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
      >
        <option value="text">Text Response</option>
        <option value="yes_no">Yes/No</option>
        <option value="number">Number (Scale)</option>
      </select>

      <div className="flex gap-3">
        <button
          // onClick={() => onSave?.({ question: newReflection, type: reflectionType })}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
        >
          Save Reflection
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
