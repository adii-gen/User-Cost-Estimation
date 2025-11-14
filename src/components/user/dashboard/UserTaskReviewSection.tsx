'use client';

import { useEffect, useState } from "react";
import { Star, MessageSquare, Loader2, Trash2, X } from "lucide-react";
import { useSession } from "next-auth/react";

interface Review {
  id: string;
  taskId: string;
  reviewerId: string;
  reviewerType: 'admin' | 'employee';
  rating: number;
  feedback: string | null;
  reply: string | null;
  repliedAt: string | null;
  createdAt: string;
  updatedAt: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface UserTaskReviewSectionProps {
  taskId: string;
  taskName: string;
  employeeId: string;
  onClose: () => void;
}

export const UserTaskReviewSection: React.FC<UserTaskReviewSectionProps> = ({
  taskId,
  taskName,
  employeeId,
  onClose,
}) => {
  const { data: session } = useSession();
  const isTaskOwner = session?.user?.id === employeeId;

  // State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Reply state
  const [replyText, setReplyText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isDeletingReply, setIsDeletingReply] = useState(false);

  // Fetch reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reviews?taskId=${taskId}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');

      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [taskId]);

  // Submit reply (Employee only)
  const handleSubmitReply = async (reviewId: string) => {
    if (!replyText.trim()) {
      alert('Please enter a reply');
      return;
    }

    setIsSubmittingReply(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit reply');
      }

      alert('Reply submitted successfully!');
      setReplyText('');
      setReplyingToId(null);
      await fetchReviews();
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit reply');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Delete reply (Employee only)
  const handleDeleteReply = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete your reply?')) return;

    setIsDeletingReply(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}/reply`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete reply');
      }

      alert('Reply deleted successfully!');
      await fetchReviews();
    } catch (error) {
      console.error('Error deleting reply:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete reply');
    } finally {
      setIsDeletingReply(false);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating
              ? 'text-yellow-500 fill-current'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Task Reviews</h3>
            <p className="text-sm text-gray-600 mt-1">{taskName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Reviews Content */}
      <div className="p-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No reviews yet for this task.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-5 bg-gray-50 hover:bg-gray-100 transition-colors">
                {/* Review Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{review.reviewerName}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {renderStars(review.rating)}
                </div>

                {/* Review Feedback */}
                {review.feedback && (
                  <p className="text-gray-700 mb-4 leading-relaxed">{review.feedback}</p>
                )}

                {/* Reply Section */}
                {isTaskOwner && (
                  <div className="mt-4">
                    {review.reply ? (
                      // Show existing reply
                      <div className="pl-4 border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-700">Your Reply</span>
                          </div>
                          <button
                            onClick={() => handleDeleteReply(review.id)}
                            disabled={isDeletingReply}
                            className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1 disabled:opacity-50 transition-colors"
                          >
                            {isDeletingReply ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                            Delete
                          </button>
                        </div>
                        <p className="text-gray-800 text-sm leading-relaxed">{review.reply}</p>
                        <span className="text-xs text-gray-500 mt-2 block">
                          Replied on {new Date(review.repliedAt!).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    ) : replyingToId === review.id ? (
                      // Show reply form
                      <div className="space-y-3">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          placeholder="Write your reply to this review..."
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSubmitReply(review.id)}
                            disabled={isSubmittingReply || !replyText.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                          >
                            {isSubmittingReply ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <MessageSquare className="w-4 h-4" />
                                Send Reply
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setReplyingToId(null);
                              setReplyText('');
                            }}
                            disabled={isSubmittingReply}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Show reply button
                      <button
                        onClick={() => setReplyingToId(review.id)}
                        className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Reply to this review
                      </button>
                    )}
                  </div>
                )}

                {/* Show reply for non-owners (read-only) */}
                {!isTaskOwner && review.reply && (
                  <div className="mt-4 pl-4 border-l-4 border-gray-300 bg-gray-100 p-4 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-700">Employee Reply</span>
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed">{review.reply}</p>
                    <span className="text-xs text-gray-500 mt-2 block">
                      {new Date(review.repliedAt!).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};