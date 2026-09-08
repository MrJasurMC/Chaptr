import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LuArrowLeft, LuChevronLeft, LuChevronRight, LuLock } from "react-icons/lu";
import api from "../api/axios";
import { recordView } from "../store/recentlyViewedSlice";
const Reader = () => {
  const {
    id
  } = useParams();
  const dispatch = useDispatch();
  const {
    user
  } = useSelector(state => state.auth);
  const [book, setBook] = useState(null);
  const [pages, setPages] = useState([]);
  const [meta, setMeta] = useState({
    free_pages: 0,
    total_pages: 0,
    locked: false
  });
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    Promise.all([api.get(`/books/${id}`), api.get(`/books/${id}/pages`)]).then(([bookRes, pagesRes]) => {
      if (cancelled) return;
      setBook(bookRes.data);
      setPages(pagesRes.data.pages || []);
      setMeta({
        free_pages: pagesRes.data.free_pages ?? 0,
        total_pages: pagesRes.data.total_pages ?? 0,
        locked: pagesRes.data.locked ?? false
      });
      setCurrent(0);
      if (user) dispatch(recordView({
        userId: user.id,
        bookId: bookRes.data.id
      }));
    }).catch(() => {
      if (!cancelled) setError("Couldn't load this book.");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);
  const slideCount = pages.length + (meta.locked ? 1 : 0);
  const onLockedSlide = meta.locked && current === pages.length;
  const goPrev = () => setCurrent(c => Math.max(0, c - 1));
  const goNext = () => setCurrent(c => Math.min(slideCount - 1, c + 1));
  if (loading) {
    return <div className="max-w-2xl mx-auto px-6 py-24 text-center text-paper-sub dark:text-ink-sub">
        Loading...
      </div>;
  }
  if (error || !book) {
    return <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-paper-sub dark:text-ink-sub mb-4">{error || "Book not found."}</p>
        <Link to="/" className="text-gold hover:underline text-sm">Back to Home</Link>
      </div>;
  }
  if (pages.length === 0) {
    return <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="font-serif italic text-2xl mb-2">{book.title}</p>
        <p className="text-paper-sub dark:text-ink-sub mb-6">
          No pages have been added to this book yet.
        </p>
        <Link to={`/book/${book.id}`} className="text-gold hover:underline text-sm">
          Back to book page
        </Link>
      </div>;
  }
  const page = onLockedSlide ? null : pages[current];
  return <div className="min-h-[calc(100vh-73px)] flex flex-col">
      <div className="border-b border-paper-border dark:border-ink-border">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={`/book/${book.id}`} className="flex items-center gap-2 text-sm text-paper-sub dark:text-ink-sub hover:text-gold transition">
            <LuArrowLeft size={15} /> {book.title}
          </Link>
          <span className="text-xs text-paper-sub dark:text-ink-sub">
            {onLockedSlide ? `Preview ended · ${meta.free_pages} of ${meta.total_pages} pages` : `Page ${page.page_number} of ${meta.total_pages}`}
          </span>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto px-6 py-16 w-full flex flex-col justify-center">
        {onLockedSlide ? <div className="text-center">
            <LuLock className="text-2xl text-gold mx-auto mb-4" />
            <p className="font-serif italic text-2xl mb-3">That's the free preview.</p>
            <p className="text-sm text-paper-sub dark:text-ink-sub mb-8 max-w-sm mx-auto">
              You've read {meta.free_pages} of {meta.total_pages} pages of "{book.title}." Buy the book for the other pages.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button type="button" title="Coming soon" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium bg-gold text-ink-bg hover:brightness-110 transition">
                Buy the book · ${Number(book.price).toFixed(2)}
              </button>
              <Link to={`/book/${book.id}`} className="inline-block px-5 py-2.5 rounded-md text-sm font-medium border border-paper-border dark:border-ink-border hover:border-gold hover:text-gold transition">
                Back to book page
              </Link>
            </div>
          </div> : <p className="text-base md:text-lg leading-loose whitespace-pre-wrap font-serif">
            {page.content}
          </p>}
      </div>

      <div className="border-t border-paper-border dark:border-ink-border sticky bottom-0 bg-paper-bg/90 dark:bg-ink-bg/90 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-2">
          <button onClick={goPrev} disabled={current === 0} aria-label="Previous page" className="flex items-center gap-1.5 text-sm px-3 sm:px-4 py-2 rounded-md border border-paper-border dark:border-ink-border disabled:opacity-30 hover:border-gold transition shrink-0">
            <LuChevronLeft size={15} /> <span className="hidden sm:inline">Previous</span>
          </button>

          {slideCount <= 10 ? <div className="flex gap-1.5 flex-wrap justify-center" role="tablist" aria-label="Pages">
              {Array.from({
            length: slideCount
          }).map((_, i) => <button key={i} onClick={() => setCurrent(i)} role="tab" aria-selected={i === current} aria-label={`Go to page ${i + 1}`} className={`w-1.5 h-1.5 rounded-full transition ${i === current ? "bg-gold w-4" : "bg-paper-border dark:bg-ink-border"}`} />)}
            </div> : <span className="text-xs text-paper-sub dark:text-ink-sub" aria-live="polite">
              {current + 1} / {slideCount}
            </span>}

          <button onClick={goNext} disabled={current === slideCount - 1} aria-label="Next page" className="flex items-center gap-1.5 text-sm px-3 sm:px-4 py-2 rounded-md border border-paper-border dark:border-ink-border disabled:opacity-30 hover:border-gold transition shrink-0">
            <span className="hidden sm:inline">Next</span> <LuChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>;
};
export default Reader;
