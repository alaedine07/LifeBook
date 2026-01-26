// src/features/moods/MoodsPage.tsx
import { useState } from 'react';
import MoodSelector from './MoodSelector';
import MoodHistory from './MoodHistory';
import type { Mood } from '../../lib/types/types';

type MoodsPageProps = {
  moods: Mood[];
  moodEmojis: Record<string, string>;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
};

export default function MoodsPage({
  moods,
  moodEmojis,
  selectedDate,
  setSelectedDate,
}: MoodsPageProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const moodList = [
    'happy',
    'sad',
    'neutral',
    'extremely_happy',
    'extremely_sad',
    'anxious',
    'tired',
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header with Date */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Mood Tracker</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      {/* Mood Selector */}
      <MoodSelector
        moodList={moodList}
        moodEmojis={moodEmojis}
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
          <button className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
            Save Mood
          </button>
        </div>
      )}

      {/* Mood History */}
      <MoodHistory moods={moods} moodEmojis={moodEmojis} />
    </div>
  );
}
