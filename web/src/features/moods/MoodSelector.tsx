// web/src/features/moods/MoodSelector.tsx
type MoodSelectorProps = {
  moodList: readonly string[];
  moodEmojis: Record<string, string>;
  selectedMood: string | null;
  onSelectMood: (mood: string) => void;
};

export default function MoodSelector({
  moodList,
  moodEmojis,
  selectedMood,
  onSelectMood,
}: MoodSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">How are you feeling?</h3>
      <div className="grid grid-cols-7 gap-3">
        {moodList.map((mood) => (
          <button
            key={mood}
            onClick={() => onSelectMood(mood)}
            className={`p-4 rounded-lg transition ${
              selectedMood === mood
                ? 'ring-4 ring-indigo-600 bg-indigo-50'
                : 'hover:bg-gray-50'
            }`}
            title={mood.replace('_', ' ')}
          >
            <p className="text-4xl mb-1">{moodEmojis[mood] || '❓'}</p>
            <p className="text-xs text-gray-600 capitalize">
              {mood.replace('_', ' ')}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
