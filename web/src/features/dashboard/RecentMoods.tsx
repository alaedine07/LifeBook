// web/src/features/dashboard/RecentMoods.tsx
import type { Mood } from '../../lib/types/types';

type RecentMoodsProps = {
  moods: Mood[];
  moodEmojis: Record<string, string>;
};

export default function RecentMoods({ moods, moodEmojis }: RecentMoodsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Moods</h3>
      <div className="space-y-3">
        {moods.slice(0, 3).map((mood) => (
          <div key={mood.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{moodEmojis[mood.type] || '❓'}</span>
              <div>
                <p className="font-semibold text-gray-800 capitalize">
                  {mood.type.replace('_', ' ')}
                </p>
                <p className="text-sm text-gray-600">{mood.date}</p>
              </div>
            </div>
            {mood.notes && <p className="text-gray-600">{mood.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
