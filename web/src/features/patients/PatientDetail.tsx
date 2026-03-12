// src/features/patients/PatientDetail.tsx
import type { Patient } from '../../lib/types/types';
import { useFetchPatientData } from '../../hooks/useTherapists';
import { useFetchReflectionComments, useAddReflectionComment, useDeleteReflectionComment, useUpdateReflectionComment } from '../../hooks/useReflectionComments';
import { useFetchMoodComments, useAddMoodComment, useDeleteMoodComment, useUpdateMoodComment } from '../../hooks/useMoodsComments';
import { MOOD_EMOJIS } from '../../lib/constants';
import CommentSection from '../../components/CommentSection';

interface PatientWithId extends Patient {
  id: number;
}

type PatientDetailProps = {
  patient: PatientWithId;
  patientDate: string;
  setPatientDate: (date: string) => void;
  onBack: () => void;
};

const formatDateTime = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export default function PatientDetail({
  patient,
  patientDate,
  setPatientDate,
  onBack,
}: PatientDetailProps) {
  const { data: patientData, isLoading } = useFetchPatientData(patient.id, patientDate);
  const answers = patientData?.answers || [];
  const moods = patientData?.moods || [];

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="text-indigo-600 hover:text-indigo-700 font-bold"
      >
        ← Back to Patients
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{patient.name}</h2>
        <p className="text-gray-600 mb-4">{patient.email}</p>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={patientDate}
            onChange={(e) => setPatientDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
      </div>

      {/* Reflections Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Reflections for {patientDate}
        </h3>
        {isLoading ? (
          <p className="text-gray-600">Loading reflections...</p>
        ) : answers.length === 0 ? (
          <p className="text-gray-600">No reflections answered for this date.</p>
        ) : (
          <div className="space-y-4">
            {answers.map((answer: any, index: number) => (
              <ReflectionCard key={answer.id} answer={answer} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Moods Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Moods for {patientDate}
        </h3>
        {isLoading ? (
          <p className="text-gray-600">Loading moods...</p>
        ) : moods.length === 0 ? (
          <p className="text-gray-600">No moods logged for this date.</p>
        ) : (
          <div className="space-y-3">
            {moods.map((mood: any) => (
              <MoodCard key={mood.id} mood={mood} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Reflection Card Component
function ReflectionCard({ answer, index }: { answer: any; index: number }) {
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
      <p className="font-semibold text-gray-800">{answer.reflection.question}</p>
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

// Mood Card Component
function MoodCard({ mood }: { mood: any }) {
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
        <p className="text-sm text-gray-600">{formatDateTime(mood.date)}</p>
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
