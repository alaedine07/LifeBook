// src/features/moods/MoodHistory.tsx
import { useFetchMoodsByDate } from '../../hooks/useMoods';
import type { Mood } from '../../lib/types/types';

type MoodHistoryProps = {
  moodEmojis: Record<string, string>;
  selectedDate: string;
};

const formatDateTime = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export default function MoodHistory({ moodEmojis, selectedDate }: MoodHistoryProps) {
  const { data: moods = [], isLoading, isError } = useFetchMoodsByDate(selectedDate);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Mood History</h3>
        <p className="text-gray-500">Loading moods...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Mood History</h3>
        <p className="text-red-500">Failed to load mood history</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Mood History</h3>
      <div className="space-y-3">
        {moods.length === 0 ? (
          <p className="text-gray-500">No moods recorded for this date</p>
        ) : (
          moods.map((mood: Mood, index: number) => (
            <div
              key={`${mood.date}-${index}`}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{moodEmojis[mood.moodType] || '❓'}</span>
                <div>
                  <p className="font-semibold text-gray-800 capitalize">
                    {mood.moodType.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-600">{formatDateTime(mood.date)}</p>
                </div>
              </div>
              {mood.note && (
                <p className="text-gray-600 max-w-xs truncate">{mood.note}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
