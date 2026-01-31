// src/features/reflections/ReflectionCard.tsx
import { useState } from 'react';
import type { Reflection } from '../../lib/types/types';
import { useCreateDailyAnswer } from '../../hooks/useDailyAnswers';

type ReflectionCardProps = {
  reflection: Reflection;
};

export default function ReflectionCard({ reflection }: ReflectionCardProps) {
  const [answer, setAnswer] = useState<Reflection['answer']>(
    reflection.answer ?? ''
  );
  const [success, setSuccess] = useState(false);
  const { mutate: saveDailyAnswer, isPending, isError, error } = useCreateDailyAnswer();

  const handleSaveAnswer = () => {
    const payload: any = {
      reflectionId: reflection.id,
    };

    if (reflection.type === 'TEXT') {
      payload.textAnswer = answer as string;
    } else if (reflection.type === 'BOOLEAN') {
      payload.booleanAnswer = answer as boolean;
    } else if (reflection.type === 'NUMBER') {
      payload.numberAnswer = answer as number;
    }

    saveDailyAnswer(payload, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      },
    });
  };

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

        {isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error instanceof Error ? error.message : 'Failed to save answer'}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Answer saved successfully!
          </div>
        )}

        <button
          onClick={handleSaveAnswer}
          disabled={isPending}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Saving...' : 'Save Answer'}
        </button>
      </div>
    </div>
  );
}
