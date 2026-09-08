import { useEffect, useRef, useState } from "react";
import { LuSearch, LuX } from "react-icons/lu";
import api from "../api/axios";
const SearchBox = () => {
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
  const showDropdown = focused && query.trim();
  return <div ref={boxRef} className="relative">
      <div className="flex items-center gap-3 rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 shadow-sm transition focus-within:border-gold focus-within:ring-1 focus-within:ring-gold/40">
        <LuSearch size={14} className="text-paper-sub dark:text-ink-sub shrink-0" />
        <input value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setFocused(true)} placeholder="Search books..." aria-label="Search books" className="w-28 min-w-0 bg-transparent text-sm text-paper-text dark:text-ink-text placeholder:text-paper-sub dark:placeholder:text-ink-sub outline-none focus:outline-none focus:ring-0 sm:w-44 md:w-56" />
        {query && <button onClick={clear} className="text-paper-sub dark:text-ink-sub hover:text-gold transition shrink-0" aria-label="Clear search">
            <LuX size={13} />
          </button>}
      </div>

      {showDropdown && <div className="absolute right-0 mt-2 w-72 rounded-lg border border-paper-border dark:border-ink-border bg-paper-bg dark:bg-ink-bg shadow-xl overflow-hidden z-30">
          {loading && <p className="px-4 py-3 text-sm text-paper-sub dark:text-ink-sub">Searching...</p>}
          {!loading && results.length === 0 && <p className="px-4 py-3 text-sm text-paper-sub dark:text-ink-sub">No books found.</p>}
          {!loading && results.map(b => <div key={b.id} className="px-4 py-3 border-t first:border-t-0 border-paper-border dark:border-ink-border hover:bg-paper-surface dark:hover:bg-ink-surface transition">
                <p className="font-serif italic text-sm">{b.title}</p>
                <p className="text-xs text-paper-sub dark:text-ink-sub mt-0.5">{b.author}</p>
              </div>)}
        </div>}
    </div>;
};
export default SearchBox;
