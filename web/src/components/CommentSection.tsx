// src/components/CommentSection.tsx
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Pencil, Trash2 } from 'lucide-react';

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
  onDeleteComment: (commentId: number) => void;
  onUpdateComment: (commentId: number, newComment: string) => void;
  isLoading: boolean;
  isAdding?: boolean;
}

export default function CommentSection({
  comments,
  onAddComment,
  onDeleteComment,
  onUpdateComment,
  isLoading,
  isAdding = false,
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const { role } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  const handleDeleteComment = (commentId: number) => {
      onDeleteComment(commentId);
  }

  const handleEditComment = (comment: Comment) => {
    setEditingId(comment.id);
    setEditingText(comment.comment);
  }

  const handleSaveEdit = (commentId: number) => {
    if (editingText.trim()) {
      onUpdateComment(commentId, editingText);
      setEditingId(null);
      setEditingText('');
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  }

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
                {editingId === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      rows={2}
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleCancelEdit}
                        className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-gray-800">{comment.comment}</p>
                      { role?.toLowerCase() === 'therapist' && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleEditComment(comment)}
                          className="text-gray-400 hover:text-blue-500 transition-colors p-0.5 rounded text-blue-500"
                          title="Edit comment"
                        >
                        <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded text-red-500"
                          title="Delete comment"
                        >
                        <Trash2 size={20} />
                        </button>
                      </div>
                      )}
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
                  </>
                )}
              </div>
            ))}
          </div>
          )}

          {/* Add Comment Form */}
          {role?.toLowerCase() === 'therapist' && (
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
          )}
        </>
      )}
    </div>
  );
}
