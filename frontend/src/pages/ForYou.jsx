import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { LuHeart, LuPencil, LuSparkles } from "react-icons/lu";
import { fetchCategories } from "../store/categoriesSlice";
import { fetchBooks } from "../store/booksSlice";
import { getInterests, setInterests as saveInterests } from "../utils/userLibrary";
import BookCard from "../components/BookCard";
const ForYou = () => {
  const dispatch = useDispatch();
  const {
    user
  } = useSelector(state => state.auth);
  const {
    items: categories
  } = useSelector(state => state.categories);
  const {
    items: books
  } = useSelector(state => state.books);
  const [selected, setSelected] = useState([]);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBooks());
  }, [dispatch]);
  useEffect(() => {
    if (user) {
      const saved = getInterests(user.id);
      setSelected(saved);
      setEditing(saved.length === 0);
    }
  }, [user]);
  if (!user) return <Navigate to="/login" replace />;
  const toggle = id => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const handleSave = () => {
    saveInterests(user.id, selected);
    setEditing(false);
  };
  const matchingBooks = books.filter(b => selected.includes(b.category_id));
  const selectedNames = categories.filter(c => selected.includes(c.id)).map(c => c.name);
  return <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center gap-2 mb-3">
        <LuSparkles size={16} className="text-gold" />
        <p className="text-xs tracking-[0.2em] uppercase text-gold">For You</p>
      </div>
      <h1 className="font-serif italic text-3xl mb-10">
        {editing ? "What do you like to read?" : "Picked for your taste"}
      </h1>

      {editing ? <div>
          {categories.length === 0 ? <p className="text-sm text-paper-sub dark:text-ink-sub">
              No genres to choose from yet — check back once the library has some categories.
            </p> : <>
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map(c => {
            const isOn = selected.includes(c.id);
            return <button key={c.id} onClick={() => toggle(c.id)} aria-pressed={isOn} className={`px-4 py-2 rounded-full text-sm border transition ${isOn ? "border-gold bg-gold text-ink-bg" : "border-paper-border dark:border-ink-border text-paper-sub dark:text-ink-sub hover:border-gold/60"}`}>
                      {c.name}
                    </button>;
          })}
              </div>
              <button onClick={handleSave} disabled={selected.length === 0} className="px-6 py-3 rounded-md text-sm font-medium bg-gold text-ink-bg disabled:opacity-40 transition">
                Show me books
              </button>
            </>}
        </div> : <div>
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-paper-sub dark:text-ink-sub">
              Based on: {selectedNames.join(", ")}
            </p>
            <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm text-gold hover:underline">
              <LuPencil size={13} /> Edit interests
            </button>
          </div>

          {matchingBooks.length === 0 ? <div className="text-center py-16">
              <LuHeart className="text-2xl text-paper-sub dark:text-ink-sub mx-auto mb-3 opacity-40" />
              <p className="text-sm text-paper-sub dark:text-ink-sub mb-4">
                Nothing in these genres yet — try a different pick.
              </p>
              <button onClick={() => setEditing(true)} className="text-sm text-gold hover:underline">
                Change interests
              </button>
            </div> : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {matchingBooks.map(b => <BookCard key={b.id} book={b} />)}
            </div>}
        </div>}
    </div>;
};
export default ForYou;
