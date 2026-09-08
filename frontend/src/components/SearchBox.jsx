import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuSearch, LuX } from "react-icons/lu";
import api from "../api/axios";

const SearchBox = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const boxRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = e => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get("/books/search", {
          params: {
            query
          }
        });
        setResults(res.data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);
  const clear = () => {
    setQuery("");
    setResults([]);
  };

  const goToBook = book => {
    const bookId = book?.id ?? book?._id;
    if (!bookId) return;

    clear();
    setFocused(false);
    navigate(`/book/${bookId}`);
  };

  const handleInputKeyDown = event => {
    if (event.key !== "Enter") return;
    if (!query.trim()) return;

    event.preventDefault();

    if (results[0]) {
      goToBook(results[0]);
    } else {
      setFocused(true);
    }
  };

  const showDropdown = focused && query.trim();
  return <div ref={boxRef} className="relative">
      <div className="flex items-center gap-3 rounded-xl border border-paper-border bg-paper-surface/50 px-4 py-3 shadow-sm transition focus-within:border-gold focus-within:ring-1 focus-within:ring-gold/40 dark:border-ink-border dark:bg-ink-surface/50">
        <LuSearch size={14} className="shrink-0 text-paper-sub dark:text-ink-sub" />
        <input value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setFocused(true)} onKeyDown={handleInputKeyDown} placeholder="Search books..." aria-label="Search books" className="w-28 min-w-0 border-0 bg-transparent p-0 text-sm text-paper-text shadow-none outline-none placeholder:text-paper-sub focus:border-0 focus:outline-none focus:ring-0 dark:text-ink-text dark:placeholder:text-ink-sub sm:w-44 md:w-56" />
        {query && <button onClick={clear} className="shrink-0 text-paper-sub transition hover:text-gold dark:text-ink-sub" aria-label="Clear search">
            <LuX size={13} />
          </button>}
      </div>

      {showDropdown && <div className="absolute right-0 mt-2 w-72 rounded-lg border border-paper-border dark:border-ink-border bg-paper-bg dark:bg-ink-bg shadow-xl overflow-hidden z-30">
          {loading && <p className="px-4 py-3 text-sm text-paper-sub dark:text-ink-sub">Searching...</p>}
          {!loading && results.length === 0 && <p className="px-4 py-3 text-sm text-paper-sub dark:text-ink-sub">No books found.</p>}
          {!loading && results.map(b => <button key={b.id ?? b._id} type="button" onClick={() => goToBook(b)} className="block w-full border-t first:border-t-0 border-paper-border px-4 py-3 text-left transition hover:bg-paper-surface dark:border-ink-border dark:hover:bg-ink-surface">
                <p className="font-serif italic text-sm text-paper-text dark:text-ink-text">{b.title}</p>
                <p className="mt-0.5 text-xs text-paper-sub dark:text-ink-sub">{b.author}</p>
              </button>)}
        </div>}
    </div>;
};
export default SearchBox;
