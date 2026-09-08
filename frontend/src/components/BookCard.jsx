import { useState } from "react";
import { Link } from "react-router-dom";
import { LuBookMarked } from "react-icons/lu";
const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/api\/?$/, "");
const coverSrc = path => path?.startsWith("/uploads") ? `${API_ORIGIN}${path}` : path;
const BookCard = ({
  book
}) => {
  const [broken, setBroken] = useState(false);
  const showImage = book.cover_image && !broken;
  return <Link to={`/book/${book.id}`} className="block rounded-lg overflow-hidden border border-paper-border dark:border-ink-border bg-paper-surface dark:bg-ink-surface group transition hover:border-gold/60 hover:shadow-lg">
      <div className="h-44 flex items-center justify-center relative bg-gradient-to-br from-[#F1E9D8] to-[#E4D8BE] dark:from-[#23232A] dark:to-[#17171B]">
        {showImage ? <img src={coverSrc(book.cover_image)} alt={book.title} onError={() => setBroken(true)} className="w-full h-full object-cover" /> : <LuBookMarked className="text-4xl opacity-20" />}
      </div>
      <div className="p-3">
        <p className="font-serif italic text-sm leading-snug">{book.title}</p>
        <p className="text-xs mt-1 text-paper-sub dark:text-ink-sub">{book.author}</p>
      </div>
    </Link>;
};
export default BookCard;
