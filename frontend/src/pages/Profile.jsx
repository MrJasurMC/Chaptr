import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { LuHeart, LuClock, LuImage, LuShieldCheck, LuPencil, LuUser, LuMail, LuLock, LuX, LuCheck, LuTrash2 } from "react-icons/lu";
import { updateProfile, clearError } from "../store/authSlice";
import { fetchFavorites } from "../store/favoritesSlice";
import { fetchRecentlyViewed, clearHistory } from "../store/recentlyViewedSlice";
import FormInput from "../components/FormInput";
const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/api\/?$/, "");
const coverSrc = path => path?.startsWith("/uploads") ? `${API_ORIGIN}${path}` : path;
const BookTile = ({
  book,
  subtitle
}) => {
  const [broken, setBroken] = useState(false);
  return <Link to={`/book/${book.id}`} className="group rounded-lg overflow-hidden border border-paper-border dark:border-ink-border bg-paper-surface dark:bg-ink-surface hover:border-gold/60 transition">
    <div className="h-36 flex items-center justify-center bg-gradient-to-br from-[#F1E9D8] to-[#E4D8BE] dark:from-[#23232A] dark:to-[#17171B]">
      {book.cover_image && !broken ? <img src={coverSrc(book.cover_image)} alt={book.title} onError={() => setBroken(true)} className="w-full h-full object-cover" /> : <LuImage className="opacity-20" />}
    </div>
    <div className="p-3">
      <p className="font-serif italic text-sm leading-snug">{book.title}</p>
      <p className="text-xs mt-1 text-paper-sub dark:text-ink-sub">{subtitle || book.author}</p>
    </div>
  </Link>;
};
const Profile = () => {
  const dispatch = useDispatch();
  const {
    user,
    status,
    error
  } = useSelector(state => state.auth);
  const {
    items: favorites
  } = useSelector(state => state.favorites);
  const {
    items: recentlyViewed
  } = useSelector(state => state.recentlyViewed);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [savedMsg, setSavedMsg] = useState(false);
  const liked = favorites.map(f => f.book).filter(Boolean);
  const recent = recentlyViewed.map(r => r.book).filter(Boolean);
  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites(user.id));
      dispatch(fetchRecentlyViewed(user.id));
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: ""
      });
    }
  }, [user, dispatch]);
  if (!user) return <Navigate to="/login" replace />;
  const handleClearHistory = () => {
    if (window.confirm("Clear your recently opened history?")) {
      dispatch(clearHistory(user.id));
    }
  };
  const initials = user.name ? user.name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase() : "";
  const openEdit = () => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: ""
    });
    dispatch(clearError());
    setSavedMsg(false);
    setEditing(true);
  };
  const cancelEdit = () => {
    setEditing(false);
    dispatch(clearError());
  };
  const handleChange = e => {
    setForm(f => ({
      ...f,
      [e.target.name]: e.target.value
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      email: form.email.trim()
    };
    if (form.password.trim()) payload.password = form.password.trim();
    const result = await dispatch(updateProfile({
      id: user.id,
      payload
    }));
    if (updateProfile.fulfilled.match(result)) {
      setEditing(false);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    }
  };
  return <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-start justify-between mb-16 gap-4">
        <div className="flex items-center gap-4">
          <span className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium bg-gold text-ink-bg shrink-0">
            {initials}
          </span>
          <div>
            <h1 className="font-serif italic text-2xl">{user.name}</h1>
            <p className="text-sm text-paper-sub dark:text-ink-sub">{user.email}</p>
            {user.role === "admin" && <span className="inline-flex items-center gap-1.5 text-xs text-gold mt-1">
                <LuShieldCheck size={13} /> Admin
              </span>}
          </div>
        </div>
        {!editing && <button onClick={openEdit} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm border border-paper-border dark:border-ink-border hover:border-gold transition shrink-0">
            <LuPencil size={14} /> Edit profile
          </button>}
      </div>

      {savedMsg && <div className="-mt-12 mb-12 text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5">
          <LuCheck size={14} /> Profile updated
        </div>}

      {editing && <form onSubmit={handleSubmit} className="-mt-8 mb-16 p-6 rounded-lg border border-paper-border dark:border-ink-border bg-paper-surface dark:bg-ink-surface max-w-md">
          <p className="text-xs uppercase tracking-wider text-paper-sub dark:text-ink-sub mb-4">
            Edit profile
          </p>
          {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
          <FormInput icon={LuUser} name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <FormInput icon={LuMail} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <FormInput icon={LuLock} name="password" type="password" placeholder="New password (leave blank to keep current)" value={form.password} onChange={handleChange} />
          <div className="flex gap-2 mt-2">
            <button type="submit" disabled={status === "loading"} className="inline-flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-medium bg-gold text-ink-bg hover:brightness-110 transition disabled:opacity-40">
              <LuCheck size={14} /> {status === "loading" ? "Saving..." : "Save changes"}
            </button>
            <button type="button" onClick={cancelEdit} className="inline-flex items-center gap-1.5 px-5 py-2 rounded-md text-sm border border-paper-border dark:border-ink-border hover:border-gold transition">
              <LuX size={14} /> Cancel
            </button>
          </div>
        </form>}

      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <LuClock size={16} className="text-gold" />
            <h2 className="font-serif italic text-xl">Recently opened</h2>
          </div>
          {recent.length > 0 && <button onClick={handleClearHistory} className="inline-flex items-center gap-1.5 text-xs text-paper-sub dark:text-ink-sub hover:text-red-500 transition">
              <LuTrash2 size={13} /> Clear history
            </button>}
        </div>
        {recent.length === 0 ? <p className="text-sm text-paper-sub dark:text-ink-sub">
            Nothing yet — books you read will show up here.
          </p> : <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {recent.map(b => <BookTile key={b.id} book={b} />)}
          </div>}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-6">
          <LuHeart size={16} className="text-gold" />
          <h2 className="font-serif italic text-xl">Liked books</h2>
        </div>
        {liked.length === 0 ? <p className="text-sm text-paper-sub dark:text-ink-sub">
            Tap the heart on any book to save it here.
          </p> : <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {liked.map(b => <BookTile key={b.id} book={b} />)}
          </div>}
      </div>
    </div>;
};
export default Profile;
