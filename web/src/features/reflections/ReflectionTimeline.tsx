import { useState, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useFetchDailyAnswersByRange } from '../../hooks/useDailyAnswers';
import { useFetchReflectionComments } from '../../hooks/useReflectionComments';
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

function getDateKey(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

function TimelineAnswerItem({ answer }: { answer: any }) {
  const { data: comments = [], isLoading: isLoadingComments } = useFetchReflectionComments(answer.id);

  const displayAnswer = answer.textAnswer || answer.booleanAnswer?.toString() || answer.numberAnswer?.toString() || '—';

  const typeColors: Record<string, string> = {
    TEXT: 'bg-blue-50 border-blue-400',
    BOOLEAN: 'bg-purple-50 border-purple-400',
    NUMBER: 'bg-green-50 border-green-400',
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 ${typeColors[answer.reflection?.type] || 'bg-gray-50 border-gray-400'}`}>
      <p className="font-semibold text-gray-800">{answer.reflection?.question}</p>
      <div className="mt-1">
        {answer.reflection?.type === 'BOOLEAN' ? (
          <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
            answer.booleanAnswer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {answer.booleanAnswer ? 'Yes' : 'No'}
          </span>
        ) : answer.reflection?.type === 'NUMBER' ? (
          <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-indigo-100 text-indigo-800">
            {answer.numberAnswer} / 10
          </span>
        ) : (
          <p className="text-gray-600">{displayAnswer}</p>
        )}
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

export default function ReflectionTimeline() {
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

  const { data: answers = [], isLoading } = useFetchDailyAnswersByRange(from, to);

  const groupedAnswers = useMemo(() => {
    const groups: Record<string, any[]> = {};
    for (const answer of answers) {
      const key = getDateKey(answer.date);
      if (!groups[key]) groups[key] = [];
      groups[key].push(answer);
    }
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [answers]);

  const handleLoadMore = useCallback(() => {
    setDaysLoaded((prev) => prev + DAYS_PER_PAGE);
  }, []);

  if (isLoading && daysLoaded === DAYS_PER_PAGE) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Reflection Timeline</h3>
        <p className="text-gray-500">Loading timeline...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Reflection Timeline</h3>
        <span className="text-sm text-gray-500">
          Last {daysLoaded} days
        </span>
      </div>

      {groupedAnswers.length === 0 ? (
        <p className="text-gray-500">No reflection answers in this period</p>
      ) : (
        <div className="space-y-6">
          {groupedAnswers.map(([dateKey, dateAnswers]) => (
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
                  <span className="text-xs text-gray-400">
                    {dateAnswers.length} answer{dateAnswers.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              {expandedDates.has(dateKey) && (
                <div className="space-y-3 pl-4 border-l-2 border-indigo-200">
                  {dateAnswers.map((answer: any) => (
                    <TimelineAnswerItem key={answer.id} answer={answer} />
                  ))}
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
