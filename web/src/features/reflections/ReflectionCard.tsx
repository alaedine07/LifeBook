// src/features/reflections/ReflectionCard.tsx
import { useState, useEffect } from 'react';
import type { Reflection } from '../../lib/types/types';
import { useCreateDailyAnswer, useUpdateDailyAnswer, useFetchDailyAnswersByDate } from '../../hooks/useDailyAnswers';

type ReflectionCardProps = {
  reflection: Reflection;
  selectedDate?: string | null;
};

export default function ReflectionCard({ reflection, selectedDate }: ReflectionCardProps) {
  const [answer, setAnswer] = useState<Reflection['answer']>(
    reflection.answer ?? ''
  );
  const [success, setSuccess] = useState(false);
  const [hasExistingAnswer, setHasExistingAnswer] = useState(false);
  const [existingAnswerId, setExistingAnswerId] = useState<number | null>(null);
  const { mutate: saveDailyAnswer, isPending: isSaving, isError: isSaveError, error: saveError } = useCreateDailyAnswer();
  const { mutate: updateDailyAnswer, isPending: isUpdating, isError: isUpdateError, error: updateError } = useUpdateDailyAnswer();
  const { data: dailyAnswers, isLoading: isFetchingAnswers } = useFetchDailyAnswersByDate(selectedDate || null);

  useEffect(() => {
    if (dailyAnswers && Array.isArray(dailyAnswers)) {
      const answerForReflection = dailyAnswers.find(
        (answer: any) => answer.reflectionId === reflection.id
      );

      if (answerForReflection) {
        if (reflection.type === 'TEXT') {
          setAnswer(answerForReflection.textAnswer || '');
        } else if (reflection.type === 'BOOLEAN') {
          setAnswer(answerForReflection.booleanAnswer);
        } else if (reflection.type === 'NUMBER') {
          setAnswer(answerForReflection.numberAnswer);
        }
        setHasExistingAnswer(true);
        setExistingAnswerId(answerForReflection.id);
      } else {
        setAnswer(reflection.answer ?? '');
        setHasExistingAnswer(false);
        setExistingAnswerId(null);
      }
    } else {
      setAnswer(reflection.answer ?? '');
      setHasExistingAnswer(false);
      setExistingAnswerId(null);
    }
  }, [dailyAnswers, reflection]);

  if (isFetchingAnswers) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {reflection.question}
        </h3>
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  const isPending = isSaving || isUpdating;
  const isError = isSaveError || isUpdateError;
  const error = saveError || updateError;

  const handleSaveAnswer = () => {
    const payload: any = {};

    if (reflection.type === 'TEXT') {
      payload.textAnswer = answer as string;
    } else if (reflection.type === 'BOOLEAN') {
      payload.booleanAnswer = answer as boolean;
    } else if (reflection.type === 'NUMBER') {
      payload.numberAnswer = answer as number;
    }

    if (hasExistingAnswer && existingAnswerId) {
      updateDailyAnswer(
        { answerId: existingAnswerId, data: payload },
        {
          onSuccess: () => {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
          },
        }
      );
    } else {
      saveDailyAnswer(
        { reflectionId: reflection.id, ...payload, date: selectedDate },
        {
          onSuccess: () => {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
          },
        }
      );
    }
  };

  return (
    <div className={`rounded-lg shadow-md p-6 transition ${
      hasExistingAnswer
        ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200'
        : 'bg-white border-2 border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex-1">
          {reflection.question}
        </h3>
        {hasExistingAnswer && (
          <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            ✓ Answered
          </span>
        )}
        {!hasExistingAnswer && (
          <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
            Pending
          </span>
        )}
      </div>

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
              min="0"
              max="10"
              value={(answer as number) ?? 5}
              onChange={(e) => setAnswer(parseInt(e.target.value, 10))}
              className="flex-1"
            />
            <span className="text-2xl font-bold text-indigo-600">
              {(answer as number) ?? 5}
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
          {isPending ? 'Saving...' : hasExistingAnswer ? 'Update Answer' : 'Save Answer'}
        </button>
      </div>
    </div>
  );
}
