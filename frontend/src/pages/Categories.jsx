import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuLibrary, LuSearch, LuSparkles, LuBookOpen, LuChevronDown } from "react-icons/lu";
import { fetchCategories } from "../store/categoriesSlice";
import { fetchBooks } from "../store/booksSlice";
import BookCard from "../components/BookCard";
export default function Categories() {
  const dispatch = useDispatch();
  const {
    items: categories
  } = useSelector(state => state.categories);
  const {
    items: books
  } = useSelector(state => state.books);
  const [active, setActive] = useState(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);
  const sortOptions = [
    ["default", "Sort: Default"],
    ["newest", "Newest first"],
    ["price_asc", "Price: Low to high"],
    ["price_desc", "Price: High to low"],
    ["title_asc", "Title: A-Z"]
  ];
  const inputClassName = "w-full min-w-0 appearance-none !border-0 !bg-transparent !p-0 text-sm text-paper-text dark:text-ink-text placeholder:text-paper-sub dark:placeholder:text-ink-sub outline-none focus:!border-0 focus:outline-none focus:ring-0";
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBooks());
  }, [dispatch]);
  const bookCount = categoryId => books.filter(b => b.category_id === categoryId).length;
  const visibleBooks = books.filter(b => {
    const matchesCategory = active ? b.category_id === active : true;
    const search = query.trim().toLowerCase();
    return matchesCategory && (!search || `${b.title} ${b.author}`.toLowerCase().includes(search));
  }).slice().sort((a, b) => {
    if (sort === "price_asc") return Number(a.price) - Number(b.price);
    if (sort === "price_desc") return Number(b.price) - Number(a.price);
    if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === "title_asc") return a.title.localeCompare(b.title);
    return 0;
  });
  return <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="text-xs tracking-[0.2em] uppercase mb-3 text-gold">Browse</p>
      <h1 className="font-serif italic text-3xl mb-3">Find something to read.</h1>
      <p className="text-sm text-paper-sub dark:text-ink-sub mb-8 max-w-xl">
        Every category opens the same way — free preview first, no exceptions.
      </p>

      <div className="grid grid-cols-3 gap-3 max-w-md mb-10">
        <div className="rounded-lg border border-paper-border dark:border-ink-border p-3 bg-paper-surface/60 dark:bg-ink-surface/60">
          <LuBookOpen className="text-gold mb-2" />
          <p className="text-lg font-serif">{books.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-paper-sub dark:text-ink-sub">Books</p>
        </div>
        <div className="rounded-lg border border-paper-border dark:border-ink-border p-3 bg-paper-surface/60 dark:bg-ink-surface/60">
          <LuLibrary className="text-gold mb-2" />
          <p className="text-lg font-serif">{categories.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-paper-sub dark:text-ink-sub">Shelves</p>
        </div>
        <div className="rounded-lg border border-paper-border dark:border-ink-border p-3 bg-paper-surface/60 dark:bg-ink-surface/60">
          <LuSparkles className="text-gold mb-2" />
          <p className="text-lg font-serif">Free</p>
          <p className="text-[10px] uppercase tracking-wider text-paper-sub dark:text-ink-sub">Preview</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mb-5">
        <label className="flex items-center gap-3 flex-1 rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 shadow-sm transition focus-within:border-gold focus-within:ring-1 focus-within:ring-gold/40">
          <LuSearch size={18} className="shrink-0 text-paper-sub dark:text-ink-sub" />
          <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by title or author..." className={inputClassName} aria-label="Search books" />
        </label>
        <div className="relative sm:w-52">
          <button type="button" onClick={() => setSortOpen(open => !open)} aria-label="Sort books" aria-expanded={sortOpen} className="flex w-full items-center justify-between rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 text-sm text-paper-text dark:text-ink-text shadow-sm outline-none transition hover:border-gold/60 focus:border-gold focus:ring-1 focus:ring-gold/50">
            {sortOptions.find(([value]) => value === sort)[1]}
            <LuChevronDown size={17} className={`text-paper-sub dark:text-ink-sub transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>
          {sortOpen && <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface dark:bg-ink-surface p-1 shadow-xl">
            {sortOptions.map(([value, label]) => <button key={value} type="button" onClick={() => { setSort(value); setSortOpen(false); }} className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${sort === value ? "bg-gold/15 text-gold" : "text-paper-text dark:text-ink-text hover:bg-gold/10"}`}>
                {label}
              </button>)}
          </div>}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 mb-10">
        <button onClick={() => setActive(null)} aria-pressed={active === null} className={`min-h-0 px-3 py-2.5 rounded-lg text-sm text-left border transition ${active === null ? "border-gold bg-gold/10 text-gold" : "border-paper-border dark:border-ink-border text-paper-sub dark:text-ink-sub hover:border-gold/60 hover:bg-gold/5"}`}>
          <span className="block font-medium">All shelves</span>
          <span className="block mt-0.5 text-[11px] opacity-60">{books.length} books</span>
        </button>
        {categories.map(c => <button key={c.id} onClick={() => setActive(c.id)} aria-pressed={active === c.id} className={`min-h-0 px-3 py-2.5 rounded-lg text-sm text-left border transition ${active === c.id ? "border-gold bg-gold/10 text-gold" : "border-paper-border dark:border-ink-border text-paper-sub dark:text-ink-sub hover:border-gold/60 hover:bg-gold/5"}`}>
            <span className="block font-medium truncate">{c.name}</span>
            <span className="block mt-0.5 text-[11px] opacity-60">{bookCount(c.id)} books</span>
          </button>)}
      </div>

      {visibleBooks.length === 0 ? <div className="flex flex-col items-center text-center py-20 text-paper-sub dark:text-ink-sub">
          <LuLibrary className="text-3xl mb-3 opacity-40" />
          <p className="text-sm">{query ? "No books match your search." : "No books here yet."}</p>
          {query && <button onClick={() => setQuery("")} className="text-xs text-gold mt-3 hover:underline">Clear search</button>}
        </div> : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {visibleBooks.map(b => <BookCard key={b.id} book={b} />)}
        </div>}
    </div>;
}
