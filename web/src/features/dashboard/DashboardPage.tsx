// web/src/features/dashboard/DashboardPage.tsx
import type { Mood } from '../../lib/types/types';
import RecentMoods from './RecentMoods';
import QuickActions from './QuickActions';

type DashboardPageProps = {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  reflections: Array<{ id: number; question: string; type: string; answer?: any }>;
  moods: Mood[];
  moodEmojis: Record<string, string>;
};

export default function DashboardPage({
  selectedDate,
  setSelectedDate,
  reflections,
  moods,
  moodEmojis,
}: DashboardPageProps) {
  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Select Date</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold opacity-90">Reflections Completed</h3>
          <p className="text-4xl font-bold mt-2">{reflections.length}/3</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold opacity-90">Current Mood</h3>
          <p className="text-4xl mt-2">😊</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold opacity-90">Today's Entries</h3>
          <p className="text-4xl font-bold mt-2">{moods.length}</p>
        </div>
      </div>

      <QuickActions />

      <RecentMoods moods={moods} moodEmojis={moodEmojis} />
    </div>
  );
}
