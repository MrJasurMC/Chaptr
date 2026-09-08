import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LuStar, LuPencil, LuTrash2, LuX, LuCheck } from "react-icons/lu";
import { fetchReviewsByBook, createReview, updateReview, deleteReview, clearReviewError } from "../store/reviewsSlice";
const StarPicker = ({
  value,
  onChange,
  size = 18,
  readOnly = false
}) => {
  const [hover, setHover] = useState(0);
  return <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => {
      const filled = readOnly ? n <= value : n <= (hover || value);
      return <button key={n} type="button" disabled={readOnly} onClick={() => onChange && onChange(n)} onMouseEnter={() => !readOnly && setHover(n)} onMouseLeave={() => !readOnly && setHover(0)} className={`${readOnly ? "cursor-default" : "cursor-pointer"} transition`} aria-label={`${n} star${n > 1 ? "s" : ""}`}>
            <LuStar size={size} className={filled ? "fill-gold text-gold" : "text-paper-sub dark:text-ink-sub"} />
          </button>;
    })}
    </div>;
};
const timeAgo = dateStr => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
};
const ReviewSection = ({
  bookId
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    user
  } = useSelector(state => state.auth);
  const {
    items: reviews,
    status,
    error
  } = useSelector(state => state.reviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    dispatch(fetchReviewsByBook(bookId));
    return () => dispatch(clearReviewError());
  }, [bookId, dispatch]);
  const myReview = user ? reviews.find(r => r.user_id === user.id) : null;
  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;
  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (rating === 0) return;
    setSubmitting(true);
    await dispatch(createReview({
      user_id: user.id,
      book_id: Number(bookId),
      rating,
      comment: comment.trim()
    }));
    setSubmitting(false);
    setRating(0);
    setComment("");
  };
  const startEdit = review => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditRating(0);
    setEditComment("");
  };
  const saveEdit = async id => {
    if (editRating === 0) return;
    await dispatch(updateReview({
      id,
      payload: {
        rating: editRating,
        comment: editComment.trim()
      }
    }));
    cancelEdit();
  };
  const handleDelete = async id => {
    if (!window.confirm("Delete this review?")) return;
    await dispatch(deleteReview(id));
  };
  return <div className="mt-16 pt-12 border-t border-paper-border dark:border-ink-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif italic text-xl">Reviews</h2>
        {avgRating && <div className="flex items-center gap-2 text-sm">
            <StarPicker value={Math.round(Number(avgRating))} readOnly size={15} />
            <span className="text-paper-sub dark:text-ink-sub">
              {avgRating} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
          </div>}
      </div>

      {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

      {user && !myReview && <form onSubmit={handleSubmit} className="mb-10 p-5 rounded-lg border border-paper-border dark:border-ink-border bg-paper-surface dark:bg-ink-surface">
          <p className="text-xs uppercase tracking-wider text-paper-sub dark:text-ink-sub mb-2">
            Leave a review
          </p>
          <StarPicker value={rating} onChange={setRating} size={22} />
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="What did you think of this book?" rows={3} className="mt-4 w-full rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 text-sm text-paper-text dark:text-ink-text placeholder:text-paper-sub dark:placeholder:text-ink-sub shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40 resize-none" />
          <button type="submit" disabled={rating === 0 || submitting} className="mt-3 px-5 py-2 rounded-md text-sm font-medium bg-gold text-ink-bg hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed">
            {submitting ? "Posting..." : "Post review"}
          </button>
        </form>}

      {!user && <p className="mb-10 text-sm text-paper-sub dark:text-ink-sub">
          <button onClick={() => navigate("/login")} className="text-gold hover:underline">
            Log in
          </button>{" "}
          to leave a review.
        </p>}

      {status === "loading" && reviews.length === 0 && <p className="text-sm text-paper-sub dark:text-ink-sub">Loading reviews...</p>}

      {status === "succeeded" && reviews.length === 0 && <p className="text-sm text-paper-sub dark:text-ink-sub">No reviews yet. Be the first to write one.</p>}

      <div className="space-y-6">
        {reviews.map(r => {
        const isMine = user && user.id === r.user_id;
        const isEditing = editingId === r.id;
        return <div key={r.id} className="pb-6 border-b border-paper-border/60 dark:border-ink-border/60 last:border-0">
              {isEditing ? <div>
                  <StarPicker value={editRating} onChange={setEditRating} size={20} />
                  <textarea value={editComment} onChange={e => setEditComment(e.target.value)} rows={3} className="mt-3 w-full rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 text-sm text-paper-text dark:text-ink-text shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40 resize-none" />
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => saveEdit(r.id)} disabled={editRating === 0} className="inline-flex items-center gap-1 px-4 py-1.5 rounded-md text-xs font-medium bg-gold text-ink-bg hover:brightness-110 transition disabled:opacity-40">
                      <LuCheck size={13} /> Save
                    </button>
                    <button onClick={cancelEdit} className="inline-flex items-center gap-1 px-4 py-1.5 rounded-md text-xs font-medium border border-paper-border dark:border-ink-border hover:border-gold transition">
                      <LuX size={13} /> Cancel
                    </button>
                  </div>
                </div> : <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{r.user?.name || "Reader"}</span>
                        <span className="text-xs text-paper-sub dark:text-ink-sub">{timeAgo(r.createdAt)}</span>
                      </div>
                      <StarPicker value={r.rating} readOnly size={14} />
                    </div>
                    {isMine && <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => startEdit(r)} aria-label="Edit review" className="text-paper-sub dark:text-ink-sub hover:text-gold transition">
                          <LuPencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(r.id)} aria-label="Delete review" className="text-paper-sub dark:text-ink-sub hover:text-red-500 transition">
                          <LuTrash2 size={14} />
                        </button>
                      </div>}
                  </div>
                  {r.comment && <p className="text-sm text-paper-sub dark:text-ink-sub mt-2 leading-relaxed">{r.comment}</p>}
                </div>}
            </div>;
      })}
      </div>
    </div>;
};
export default ReviewSection;
