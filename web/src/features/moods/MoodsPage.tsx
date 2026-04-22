// src/features/moods/MoodsPage.tsx
import { useState } from 'react';
import MoodSelector from './MoodSelector';
import MoodHistory from './MoodHistory';
import MoodTimeline from './MoodTimeline';
import { useCreateMood } from '../../hooks/useMoods';
import { MOOD_EMOJIS } from '../../lib/constants';
import type { Mood } from '../../lib/types/types';

type MoodsPageProps = {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
};

export default function MoodsPage({
  selectedDate,
  setSelectedDate,
}: MoodsPageProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [viewMode, setViewMode] = useState<'today' | 'timeline'>('today');
  const { mutate: createMood, isPending } = useCreateMood();

  const moodList = [
    'HAPPY',
    'SAD',
    'NEUTRAL',
    'EXTREMELY_HAPPY',
    'EXTREMELY_SAD',
    'ANXIOUS',
    'TIRED',
  ] as const;

  const handleSaveMood = () => {
    if (!selectedMood) return;

    const moodData: Mood = {
      moodType: selectedMood,
      date: selectedDate,
      note: notes.trim() || undefined,
    };

    createMood(moodData, {
      onSuccess: () => {
        setSelectedMood(null);
        setNotes('');
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Mood Tracker</h2>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('today')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                viewMode === 'today'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                viewMode === 'timeline'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Timeline
            </button>
          </div>
          {viewMode === 'today' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          )}
        </div>
      </div>

      {/* Mood Selector (always visible) */}
      <MoodSelector
        moodList={moodList}
        moodEmojis={MOOD_EMOJIS}
        selectedMood={selectedMood}
        onSelectMood={setSelectedMood}
      />

      {/* Notes & Save (only shown when mood is selected) */}
      {selectedMood && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <label className="block text-lg font-bold text-gray-800 mb-3">
            Add Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 h-24"
          />
          <button
            onClick={handleSaveMood}
            disabled={isPending}
            className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isPending ? 'Saving...' : 'Save Mood'}
          </button>
        </div>
      )}

      {/* Mood History / Timeline */}
      {viewMode === 'today' ? (
        <MoodHistory moodEmojis={MOOD_EMOJIS} selectedDate={selectedDate} moodList={moodList} />
      ) : (
        <MoodTimeline moodEmojis={MOOD_EMOJIS} moodList={moodList} />
      )}
    </div>
  );
}
