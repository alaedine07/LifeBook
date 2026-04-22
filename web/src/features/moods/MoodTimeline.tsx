import { useState, useMemo, useCallback } from 'react';
import { Trash2, Edit2, ChevronDown } from 'lucide-react';
import { useFetchMoodsByRange, useUpdateMood, useDeleteMood } from '../../hooks/useMoods';
import { useFetchMoodComments } from '../../hooks/useMoodsComments';
import CommentSection from '../../components/CommentSection';
import type { Mood } from '../../lib/types/types';

type MoodTimelineProps = {
  moodEmojis: Record<string, string>;
  moodList: readonly string[];
};

const DAYS_PER_PAGE = 14;

function formatDateHeader(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);

  if (dateOnly.getTime() === today.getTime()) return 'Today';
  if (dateOnly.getTime() === yesterday.getTime()) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function getDateKey(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

function TimelineMoodItem({
  mood,
  moodEmojis,
  moodList,
}: {
  mood: Mood;
  moodEmojis: Record<string, string>;
  moodList: readonly string[];
}) {
  const moodId = mood.id || 0;
  const { data: comments = [], isLoading: isLoadingComments } = useFetchMoodComments(moodId);
  const { mutate: updateMood, isPending: isUpdating } = useUpdateMood();
  const { mutate: deleteMood, isPending: isDeleting } = useDeleteMood();
  const [isEditing, setIsEditing] = useState(false);
  const [editMoodType, setEditMoodType] = useState(mood.moodType);
  const [editNote, setEditNote] = useState(mood.note || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    if (mood.id) {
      updateMood(
        { id: mood.id, moodType: editMoodType, note: editNote },
        { onSuccess: () => setIsEditing(false) },
      );
    }
  };

  const handleDelete = () => {
    if (mood.id) {
      deleteMood(mood.id, { onSuccess: () => setShowDeleteConfirm(false) });
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg space-y-3">
        <div className="flex gap-4">
          <select
            value={editMoodType}
            onChange={(e) => setEditMoodType(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            {moodList.map((m) => (
              <option key={m} value={m}>
                {moodEmojis[m]} {m.replace('_', ' ')}
              </option>
            ))}
          </select>
          <span className="text-3xl">{moodEmojis[editMoodType]}</span>
        </div>
        <textarea
          value={editNote}
          onChange={(e) => setEditNote(e.target.value)}
          placeholder="Add a note (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          rows={2}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="px-4 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-1 bg-gray-400 text-white rounded-lg text-sm hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <span className="text-3xl">{moodEmojis[mood.moodType] || '❓'}</span>
          <div className="flex-1">
            <p className="font-semibold text-gray-800 capitalize">
              {mood.moodType.replace('_', ' ')}
            </p>
            <p className="text-sm text-gray-500">{formatTime(mood.date)}</p>
            {mood.note && <p className="text-gray-600 text-sm mt-1">{mood.note}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditMoodType(mood.moodType);
              setEditNote(mood.note || '');
              setIsEditing(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          {showDeleteConfirm ? (
            <>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 text-sm bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <CommentSection
        comments={comments}
        onAddComment={() => {}}
        onDeleteComment={() => {}}
        onUpdateComment={() => {}}
        isLoading={isLoadingComments}
      />
    </div>
  );
}

export default function MoodTimeline({ moodEmojis, moodList }: MoodTimelineProps) {
  const [daysLoaded, setDaysLoaded] = useState(DAYS_PER_PAGE);

  const { to, from } = useMemo(() => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - daysLoaded + 1);
    return {
      to: toDate.toISOString().split('T')[0],
      from: fromDate.toISOString().split('T')[0],
    };
  }, [daysLoaded]);

  const { data: moods = [], isLoading } = useFetchMoodsByRange(from, to);

  const groupedMoods = useMemo(() => {
    const groups: Record<string, Mood[]> = {};
    for (const mood of moods) {
      const key = getDateKey(mood.date);
      if (!groups[key]) groups[key] = [];
      groups[key].push(mood);
    }
    // Sort dates descending
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [moods]);

  const handleLoadMore = useCallback(() => {
    setDaysLoaded((prev) => prev + DAYS_PER_PAGE);
  }, []);

  if (isLoading && daysLoaded === DAYS_PER_PAGE) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Mood Timeline</h3>
        <p className="text-gray-500">Loading timeline...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Mood Timeline</h3>
        <span className="text-sm text-gray-500">
          Last {daysLoaded} days
        </span>
      </div>

      {groupedMoods.length === 0 ? (
        <p className="text-gray-500">No moods recorded in this period</p>
      ) : (
        <div className="space-y-6">
          {groupedMoods.map(([dateKey, dateMoods]) => (
            <div key={dateKey}>
              {/* Sticky date header */}
              <div className="sticky top-0 z-10 bg-white pb-2 mb-3 border-b border-gray-200">
                <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                  {formatDateHeader(dateKey)}
                </h4>
              </div>
              <div className="space-y-3 pl-4 border-l-2 border-indigo-200">
                {dateMoods.map((mood, idx) => (
                  <TimelineMoodItem
                    key={mood.id || idx}
                    mood={mood}
                    moodEmojis={moodEmojis}
                    moodList={moodList}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      <div className="mt-6 text-center">
        <button
          onClick={handleLoadMore}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition font-medium disabled:opacity-50"
        >
          <ChevronDown className="w-4 h-4" />
          {isLoading ? 'Loading...' : 'Load older entries'}
        </button>
      </div>
    </div>
  );
}
