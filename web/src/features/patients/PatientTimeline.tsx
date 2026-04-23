import { useState, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useFetchPatientDataRange } from '../../hooks/useTherapists';
import { useFetchReflectionComments, useAddReflectionComment, useDeleteReflectionComment, useUpdateReflectionComment } from '../../hooks/useReflectionComments';
import { useFetchMoodComments, useAddMoodComment, useDeleteMoodComment, useUpdateMoodComment } from '../../hooks/useMoodsComments';
import { MOOD_EMOJIS } from '../../lib/constants';
import CommentSection from '../../components/CommentSection';

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

function PatientReflectionItem({ answer, index }: { answer: any; index: number }) {
  const { data: comments = [], isLoading } = useFetchReflectionComments(answer.id);
  const { mutate: addComment, isPending: isAdding } = useAddReflectionComment(answer.id);
  const { mutate: deleteReflectionComment } = useDeleteReflectionComment();
  const { mutate: updateReflectionComment } = useUpdateReflectionComment();

  const handleUpdateComment = (commentId: number, newComment: string) => {
    updateReflectionComment({ commentId, comment: newComment });
  };

  const bgColors = [
    'bg-blue-50 border-blue-500',
    'bg-purple-50 border-purple-500',
    'bg-green-50 border-green-500',
  ];

  return (
    <div className={`p-4 rounded-lg border-l-4 ${bgColors[index % 3]}`}>
      <p className="font-semibold text-gray-800">{answer.reflection?.question}</p>
      <p className="text-gray-600 mt-1">
        {answer.textAnswer || answer.booleanAnswer?.toString() || answer.numberAnswer}
      </p>
      <CommentSection
        comments={comments}
        onAddComment={addComment}
        onDeleteComment={deleteReflectionComment}
        onUpdateComment={handleUpdateComment}
        isLoading={isLoading}
        isAdding={isAdding}
      />
    </div>
  );
}

function PatientMoodItem({ mood }: { mood: any }) {
  const { data: comments = [], isLoading } = useFetchMoodComments(mood.id);
  const { mutate: addComment, isPending: isAdding } = useAddMoodComment(mood.id);
  const { mutate: deleteMoodComment } = useDeleteMoodComment();
  const { mutate: updateMoodComment } = useUpdateMoodComment();

  const handleUpdateComment = (commentId: number, newComment: string) => {
    updateMoodComment({ commentId, comment: newComment });
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
      <span className="text-3xl flex-shrink-0">{MOOD_EMOJIS[mood.moodType] || '❓'}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 capitalize">{mood.moodType.replace('_', ' ')}</p>
        <p className="text-sm text-gray-500">{formatTime(mood.date)}</p>
        {mood.note && <p className="text-sm text-gray-600">{mood.note}</p>}
        <CommentSection
          comments={comments}
          onAddComment={addComment}
          onDeleteComment={deleteMoodComment}
          onUpdateComment={handleUpdateComment}
          isLoading={isLoading}
          isAdding={isAdding}
        />
      </div>
    </div>
  );
}

type PatientTimelineProps = {
  patientId: number;
};

export default function PatientTimeline({ patientId }: PatientTimelineProps) {
  const [daysLoaded, setDaysLoaded] = useState(DAYS_PER_PAGE);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  const toggleDate = useCallback((dateKey: string) => {
    setExpandedDates((prev) => {
      const next = new Set(prev);
      if (next.has(dateKey)) next.delete(dateKey);
      else next.add(dateKey);
      return next;
    });
  }, []);

  const { to, from } = useMemo(() => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - daysLoaded + 1);
    return {
      to: toDate.toISOString().split('T')[0],
      from: fromDate.toISOString().split('T')[0],
    };
  }, [daysLoaded]);

  const { data, isLoading } = useFetchPatientDataRange(patientId, from, to);
  const answers = data?.answers || [];
  const moods = data?.moods || [];

  // Merge moods and answers into a single timeline grouped by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, { moods: any[]; answers: any[] }> = {};

    for (const mood of moods) {
      const key = getDateKey(mood.date);
      if (!groups[key]) groups[key] = { moods: [], answers: [] };
      groups[key].moods.push(mood);
    }

    for (const answer of answers) {
      const key = getDateKey(answer.date);
      if (!groups[key]) groups[key] = { moods: [], answers: [] };
      groups[key].answers.push(answer);
    }

    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [moods, answers]);

  const handleLoadMore = useCallback(() => {
    setDaysLoaded((prev) => prev + DAYS_PER_PAGE);
  }, []);

  if (isLoading && daysLoaded === DAYS_PER_PAGE) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Patient Timeline</h3>
        <p className="text-gray-500">Loading timeline...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Patient Timeline</h3>
        <span className="text-sm text-gray-500">Last {daysLoaded} days</span>
      </div>

      {groupedByDate.length === 0 ? (
        <p className="text-gray-500">No data recorded in this period</p>
      ) : (
        <div className="space-y-6">
          {groupedByDate.map(([dateKey, { moods: dayMoods, answers: dayAnswers }]) => (
            <div key={dateKey}>
              <div
                className="sticky top-0 z-10 bg-white pb-2 mb-3 border-b border-gray-200 cursor-pointer select-none"
                onClick={() => toggleDate(dateKey)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {expandedDates.has(dateKey) ? (
                      <ChevronDown className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-indigo-600" />
                    )}
                    <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                      {formatDateHeader(dateKey)}
                    </h4>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-400">
                    {dayMoods.length > 0 && (
                      <span>{dayMoods.length} mood{dayMoods.length !== 1 ? 's' : ''}</span>
                    )}
                    {dayAnswers.length > 0 && (
                      <span>{dayAnswers.length} reflection{dayAnswers.length !== 1 ? 's' : ''}</span>
                    )}
                  </div>
                </div>
              </div>

              {expandedDates.has(dateKey) && (
                <div className="space-y-3 pl-4 border-l-2 border-indigo-200">
                  {/* Moods for this day */}
                  {dayMoods.length > 0 && (
                    <div className="space-y-2">
                      {dayMoods.map((mood: any) => (
                        <PatientMoodItem key={mood.id} mood={mood} />
                      ))}
                    </div>
                  )}

                  {/* Answers for this day */}
                  {dayAnswers.length > 0 && (
                    <div className="space-y-2">
                      {dayAnswers.map((answer: any, idx: number) => (
                        <PatientReflectionItem key={answer.id} answer={answer} index={idx} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

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
