'use client';

import { useEffect, useState } from "react";
import { Star, MessageSquare, Loader2, Edit2, Trash2, X, Save } from "lucide-react";
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

interface TaskReviewSectionProps {
  taskId: string;
  taskName: string;
  employeeName: string;
  employeeId: string;
}

export const TaskReviewSection: React.FC<TaskReviewSectionProps> = ({
  taskId,
  taskName,
  employeeName,
  employeeId,
}) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'platform_admin';
  const isTaskOwner = session?.user?.id === employeeId;

  // State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [myReview, setMyReview] = useState<Review | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editFeedback, setEditFeedback] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

      // Find current admin's review
      if (isAdmin && session?.user?.id) {
        const adminReview = data.reviews.find(
          (r: Review) => r.reviewerId === session.user.id
        );
        setMyReview(adminReview || null);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [taskId, session?.user?.id]);

  // Create review (Admin only)
  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          rating,
          feedback: feedback.trim() || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      // alert('Review submitted successfully!');
      setRating(0);
      setFeedback('');
      setShowForm(false);
      await fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update review (Admin only)
  const handleUpdateReview = async (reviewId: string) => {
    if (editRating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: editRating,
          feedback: editFeedback.trim() || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update review');
      }

      // alert('Review updated successfully!');
      setEditingReviewId(null);
      await fetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
      alert(error instanceof Error ? error.message : 'Failed to update review');
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete review (Admin only)
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete review');
      }

      // alert('Review deleted successfully!');
      await fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete review');
    } finally {
      setIsDeleting(false);
    }
  };

  // Start editing
  const handleStartEdit = (review: Review) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditFeedback(review.feedback || '');
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(0);
    setEditFeedback('');
  };

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

      // alert('Reply submitted successfully!');
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

  const renderStars = (currentRating: number, onSelect?: (rating: number) => void) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onSelect?.(star)}
          disabled={!onSelect}
          className={`${onSelect ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <Star
            className={`w-6 h-6 ${
              star <= currentRating
                ? 'text-yellow-500 fill-current'
                : 'text-gray-300'
            }`}
          />
        </button>
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Task Reviews</h3>
        <p className="text-sm text-gray-600 mt-1">
          {taskName} - {employeeName}
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Admin: Create/Edit Review Form */}
        {isAdmin && (
          <div>
            {myReview ? (
              // Show existing review with edit/delete options
              <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-gray-900">Your Review</p>
                    <span className="text-xs text-gray-500">
                      {new Date(myReview.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  {editingReviewId !== myReview.id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartEdit(myReview)}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(myReview.id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {editingReviewId === myReview.id ? (
                  // Edit mode
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      {renderStars(editRating, setEditRating)}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Feedback
                      </label>
                      <textarea
                        value={editFeedback}
                        onChange={(e) => setEditFeedback(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Update your feedback..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateReview(myReview.id)}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center gap-2"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Update
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div>
                    {renderStars(myReview.rating)}
                    {myReview.feedback && (
                      <p className="text-gray-700 mt-2">{myReview.feedback}</p>
                    )}
                    
                    {/* Employee Reply */}
                    {myReview.reply && (
                      <div className="mt-4 pl-4 border-l-2 border-green-500 bg-green-50 p-3 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">
                            Employee Reply
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{myReview.reply}</p>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {new Date(myReview.repliedAt!).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              // Show create form
              <div>
                {!showForm ? (
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-600 hover:text-blue-600 font-medium"
                  >
                    + Add Review for this Task
                  </button>
                ) : (
                  <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating (1-5 stars) *
                      </label>
                      {renderStars(rating, setRating)}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Feedback (Optional)
                      </label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Share your thoughts about this task..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSubmitReview}
                        disabled={rating === 0 || isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Review'
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setShowForm(false);
                          setRating(0);
                          setFeedback('');
                        }}
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Employee: Reply to Reviews */}
        {isTaskOwner && reviews.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Admin Reviews</h4>
            {reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{review.reviewerName}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  {renderStars(review.rating)}
                </div>
                {review.feedback && (
                  <p className="text-gray-700 mt-2">{review.feedback}</p>
                )}

                {/* Reply Section */}
                {review.reply ? (
                  <div className="mt-4 pl-4 border-l-2 border-blue-500 bg-white p-3 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">Your Reply</span>
                      </div>
                      <button
                        onClick={() => handleDeleteReply(review.id)}
                        disabled={isDeletingReply}
                        className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                      >
                        {isDeletingReply ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        Delete
                      </button>
                    </div>
                    <p className="text-gray-700 text-sm">{review.reply}</p>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {new Date(review.repliedAt!).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                ) : replyingToId === review.id ? (
                  <div className="mt-4 space-y-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Write your reply..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSubmitReply(review.id)}
                        disabled={isSubmittingReply}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                      >
                        {isSubmittingReply ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Send Reply'
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setReplyingToId(null);
                          setReplyText('');
                        }}
                        disabled={isSubmittingReply}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setReplyingToId(review.id)}
                    className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Reply
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* All Reviews Display (for viewing only - not admin or task owner) */}
        {!isAdmin && !isTaskOwner && reviews.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Reviews</h4>
            {reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{review.reviewerName}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  {renderStars(review.rating)}
                </div>
                {review.feedback && (
                  <p className="text-gray-700 mt-2">{review.feedback}</p>
                )}
                {review.reply && (
                  <div className="mt-3 pl-4 border-l-2 border-gray-300 bg-gray-50 p-3 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">Employee Reply</span>
                    </div>
                    <p className="text-gray-700 text-sm">{review.reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {reviews.length === 0 && !isAdmin && (
          <p className="text-center text-gray-500 py-8">No reviews yet for this task.</p>
        )}
      </div>
    </div>
  );
};