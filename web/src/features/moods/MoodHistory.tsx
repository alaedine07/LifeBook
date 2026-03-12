// src/features/moods/MoodHistory.tsx
import { useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { useFetchMoodsByDate, useUpdateMood, useDeleteMood } from '../../hooks/useMoods';
import { useFetchMoodComments } from '../../hooks/useMoodsComments';
import CommentSection from '../../components/CommentSection';
import type { Mood } from '../../lib/types/types';

type MoodHistoryProps = {
  moodEmojis: Record<string, string>;
  selectedDate: string;
  moodList: readonly string[];
};

type MoodItemProps = {
  mood: Mood;
  moodEmojis: Record<string, string>;
  moodList: readonly string[];
  editingId: number | null;
  editMoodType: string;
  editNote: string;
  isUpdating: boolean;
  isDeleting: boolean;
  deletingId: number | null;
  onEdit: (mood: Mood) => void;
  onSaveEdit: (id: number | undefined) => void;
  onCancelEdit: () => void;
  onDeleteClick: (id: number | undefined) => void;
  onConfirmDelete: (id: number | undefined) => void;
  onCancelDelete: () => void;
  setEditMoodType: (val: string) => void;
  setEditNote: (val: string) => void;
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

function MoodItem({
  mood,
  moodEmojis,
  moodList,
  editingId,
  editMoodType,
  editNote,
  isUpdating,
  isDeleting,
  deletingId,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDeleteClick,
  onConfirmDelete,
  onCancelDelete,
  setEditMoodType,
  setEditNote,
}: MoodItemProps) {
  const moodId = mood.id || 0;
  const { data: comments = [], isLoading: isLoadingComments } = useFetchMoodComments(moodId);

  return (
    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
      {editingId === mood.id ? (
        <div className="space-y-3">
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
              onClick={() => onSaveEdit(mood.id)}
              disabled={isUpdating}
              className="px-4 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={onCancelEdit}
              className="px-4 py-1 bg-gray-400 text-white rounded-lg text-sm hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <span className="text-3xl">{moodEmojis[mood.moodType] || '❓'}</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 capitalize">
                  {mood.moodType.replace('_', ' ')}
                </p>
                <p className="text-sm text-gray-600">{formatDateTime(mood.date)}</p>
                {mood.note && <p className="text-gray-600 text-sm mt-1">{mood.note}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(mood)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              {deletingId === mood.id ? (
                <>
                  <button
                    onClick={() => onConfirmDelete(mood.id)}
                    disabled={isDeleting}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={onCancelDelete}
                    className="px-3 py-1 text-sm bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onDeleteClick(mood.id)}
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
            onAddComment={() => {}} // Users can only view comments, not add, modify or delete them in this context
            onDeleteComment={() => {}}
            onUpdateComment={() => {}}
            isLoading={isLoadingComments}
          />
        </div>
      )}
    </div>
  );
}

export default function MoodHistory({ moodEmojis, selectedDate, moodList }: MoodHistoryProps) {
  const { data: moods = [], isLoading, isError } = useFetchMoodsByDate(selectedDate);
  const { mutate: updateMood, isPending: isUpdating } = useUpdateMood();
  const { mutate: deleteMood, isPending: isDeleting } = useDeleteMood();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editMoodType, setEditMoodType] = useState('');
  const [editNote, setEditNote] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleEdit = (mood: Mood) => {
    setEditingId(mood.id || null);
    setEditMoodType(mood.moodType);
    setEditNote(mood.note || '');
  };

  const handleSaveEdit = (id: number | undefined) => {
    if (id) {
      updateMood(
        { id, moodType: editMoodType, note: editNote },
        {
          onSuccess: () => {
            setEditingId(null);
            setEditMoodType('');
            setEditNote('');
          },
        }
      );
    }
  };

  const handleDeleteClick = (id: number | undefined) => {
    setDeletingId(id || null);
  };

  const handleConfirmDelete = (id: number | undefined) => {
    if (id) {
      deleteMood(id, {
        onSuccess: () => setDeletingId(null),
      });
    }
  };

  const sortedMoods = [...moods].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
          sortedMoods.map((mood: Mood, index: number) => (
            <MoodItem
              key={`${mood.date}-${index}`}
              mood={mood}
              moodEmojis={moodEmojis}
              moodList={moodList}
              editingId={editingId}
              editMoodType={editMoodType}
              editNote={editNote}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
              deletingId={deletingId}
              onEdit={handleEdit}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={() => {
                setEditingId(null);
                setEditMoodType('');
                setEditNote('');
              }}
              onDeleteClick={handleDeleteClick}
              onConfirmDelete={handleConfirmDelete}
              onCancelDelete={() => setDeletingId(null)}
              setEditMoodType={setEditMoodType}
              setEditNote={setEditNote}
            />
          ))
        )}
      </div>
    </div>
  );
}
