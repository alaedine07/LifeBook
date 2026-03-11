// src/components/CommentSection.tsx
import { useState } from 'react';

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

interface Comment {
  id: number;
  comment: string;
  createdAt: string | Date;
  therapist?: {
    id: number;
    name?: string;
    username?: string;
  };
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (comment: string) => void;
  isLoading: boolean;
  isAdding?: boolean;
}

export default function CommentSection({
  comments,
  onAddComment,
  isLoading,
  isAdding = false,
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 mb-3"
      >
        {isExpanded ? '▼' : '▶'} Comments ({comments.length})
      </button>

      {isExpanded && (
        <>
          {/* Comments List */}
          {isLoading ? (
            <p className="text-sm text-gray-500 mb-3">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-gray-500 mb-3">No comments yet.</p>
          ) : (
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded text-sm">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-gray-800">{comment.comment}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {comment.therapist?.name && (
                      <span className="font-semibold">{comment.therapist.name}</span>
                    )}
                    {comment.therapist?.username && !comment.therapist?.name && (
                      <span className="font-semibold">{comment.therapist.username}</span>
                    )}
                    {(comment.therapist?.name || comment.therapist?.username) && ' • '}
                    {formatDateTime(comment.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || isAdding}
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isAdding ? 'Adding...' : 'Add Comment'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
