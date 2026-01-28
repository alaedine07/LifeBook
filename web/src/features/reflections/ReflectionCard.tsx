// src/features/reflections/ReflectionCard.tsx
import { useState } from 'react';
import type { Reflection } from '../../lib/types/types';

type ReflectionCardProps = {
  reflection: Reflection;
};

export default function ReflectionCard({ reflection }: ReflectionCardProps) {
  const [answer, setAnswer] = useState<Reflection['answer']>(
    reflection.answer ?? ''
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {reflection.question}
      </h3>

      <div className="space-y-3">
        {reflection.type === 'TEXT' && (
          <textarea
            value={answer as string}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your response..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 h-24"
          />
        )}

        {reflection.type === 'BOOLEAN' && (
          <div className="flex gap-4">
            <button
              className={`flex-1 py-2 px-4 rounded-lg font-bold transition ${
                answer === true
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setAnswer(true)}
            >
              Yes
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-lg font-bold transition ${
                answer === false
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setAnswer(false)}
            >
              No
            </button>
          </div>
        )}

        {reflection.type === 'NUMBER' && (
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              value={(answer as number) || 5}
              onChange={(e) => setAnswer(parseInt(e.target.value, 10))}
              className="flex-1"
            />
            <span className="text-2xl font-bold text-indigo-600">
              {(answer as number) || 5}
            </span>
          </div>
        )}

        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition">
          Save Answer
        </button>
      </div>
    </div>
  );
}
