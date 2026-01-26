// src/features/moods/MoodHistory.tsx
import type { Mood } from '../../lib/types/types';

type MoodHistoryProps = {
  moods: Mood[];
  moodEmojis: Record<string, string>;
};

export default function MoodHistory({ moods, moodEmojis }: MoodHistoryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Mood History</h3>
      <div className="space-y-3">
        {moods.map((mood) => (
          <div
            key={mood.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{moodEmojis[mood.type] || '❓'}</span>
              <div>
                <p className="font-semibold text-gray-800 capitalize">
                  {mood.type.replace('_', ' ')}
                </p>
                <p className="text-sm text-gray-600">{mood.date}</p>
              </div>
            </div>
            {mood.notes && (
              <p className="text-gray-600 max-w-xs truncate">{mood.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
