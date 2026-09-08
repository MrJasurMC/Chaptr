import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LuBookOpen, LuImage, LuHeart } from "react-icons/lu";
import { fetchBookById, fetchBooks } from "../store/booksSlice";
import { fetchCategories } from "../store/categoriesSlice";
import { fetchFavorites, addFavorite, removeFavorite } from "../store/favoritesSlice";
import ReviewSection from "../components/ReviewSection";
import BookCard from "../components/BookCard";
const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/api\/?$/, "");
const coverSrc = path => path?.startsWith("/uploads") ? `${API_ORIGIN}${path}` : path;
const BookDetail = () => {
  const {
    id
  } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    items: books
  } = useSelector(state => state.books);
  const {
    items: categories
  } = useSelector(state => state.categories);
  const {
    user
  } = useSelector(state => state.auth);
  const {
    items: favorites
  } = useSelector(state => state.favorites);
  const book = books.find(b => b.id === Number(id));
  const liked = user ? favorites.some(f => f.book_id === book?.id) : false;
  const [coverBroken, setCoverBroken] = useState(false);
  useEffect(() => {
    setCoverBroken(false);
  }, [book?.id]);
  useEffect(() => {
    dispatch(fetchBookById(id));
    if (books.length === 0) dispatch(fetchBooks());
    if (categories.length === 0) dispatch(fetchCategories());
  }, [id]);
  useEffect(() => {
    if (user) dispatch(fetchFavorites(user.id));
  }, [user, dispatch]);
  if (!book) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-paper-sub dark:text-ink-sub">
        Loading book...
      </div>;
  }
  const categoryName = categories.find(c => c.id === book.category_id)?.name;
  const related = books.filter(b => b.category_id === book.category_id && b.id !== book.id).slice(0, 4);
  const handleLike = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (liked) {
      dispatch(removeFavorite({
        userId: user.id,
        bookId: book.id
      }));
    } else {
      dispatch(addFavorite({
        userId: user.id,
        bookId: book.id
      }));
    }
  };
  return <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 text-xs text-paper-sub dark:text-ink-sub mb-8">
        <Link to="/" className="hover:text-gold transition">Home</Link>
        <span>/</span>
        {categoryName && <>
            <span>{categoryName}</span>
            <span>/</span>
          </>}
        <span className="text-paper-text dark:text-ink-text">{book.title}</span>
      </div>

      <div className="grid md:grid-cols-[280px_1fr] gap-10 mb-16">
        <div className="w-full aspect-[3/4] rounded-lg overflow-hidden border border-paper-border dark:border-ink-border bg-gradient-to-br from-[#F1E9D8] to-[#E4D8BE] dark:from-[#23232A] dark:to-[#17171B] flex items-center justify-center">
          {book.cover_image && !coverBroken ? <img src={coverSrc(book.cover_image)} alt={book.title} onError={() => setCoverBroken(true)} className="w-full h-full object-cover" /> : <LuImage className="text-4xl opacity-20" />}
        </div>

        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-3">
            {categoryName && <span className="text-xs tracking-[0.15em] uppercase text-gold">{categoryName}</span>}
            <button onClick={handleLike} aria-label={liked ? "Unlike this book" : "Like this book"} className="w-9 h-9 rounded-full flex items-center justify-center border border-paper-border dark:border-ink-border hover:border-gold transition shrink-0">
              <LuHeart size={16} className={liked ? "fill-gold text-gold" : ""} />
            </button>
          </div>
          <h1 className="font-serif italic text-3xl md:text-4xl mb-2 leading-tight">{book.title}</h1>
          <p className="text-sm text-paper-sub dark:text-ink-sub mb-5">by {book.author}</p>

          <p className="text-2xl font-serif mb-6">${Number(book.price).toFixed(2)}</p>

          {book.description && <p className="text-sm leading-relaxed text-paper-sub dark:text-ink-sub mb-8 max-w-xl">
              {book.description}
            </p>}

          <Link to={`/read/${book.id}`} className="inline-flex items-center gap-2 w-fit px-6 py-3 rounded-md text-sm font-medium bg-gold text-ink-bg hover:brightness-110 transition">
            <LuBookOpen size={16} /> Start reading
          </Link>
        </div>
      </div>

      {related.length > 0 && <div>
          <h2 className="font-serif italic text-xl mb-6">More in {categoryName}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map(b => <BookCard key={b.id} book={b} />)}
          </div>
        </div>}

      <ReviewSection bookId={book.id} />
    </div>;
};
export default BookDetail;
