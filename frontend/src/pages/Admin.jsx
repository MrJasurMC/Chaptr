import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuPlus, LuPencil, LuTrash2, LuX, LuUpload, LuImage, LuFileText, LuShieldCheck } from "react-icons/lu";
import { fetchBooks, createBook, updateBook, deleteBook } from "../store/booksSlice";
import { fetchCategories, createCategory } from "../store/categoriesSlice";
import { fetchPagesForBook, createPage, updatePage, deletePage, clearPages } from "../store/pagesSlice";
import { updateProfile } from "../store/authSlice";
import { rtfToText } from "../utils/rtfToText";
import api from "../api/axios";
const emptyForm = {
  title: "",
  author: "",
  description: "",
  category_id: "",
  total_pages: "",
  free_pages: "2",
  price: "",
  cover_image: ""
};
const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/api\/?$/, "");
const Admin = () => {
  const dispatch = useDispatch();
  const {
    user
  } = useSelector(state => state.auth);
  const {
    items: books
  } = useSelector(state => state.books);
  const {
    items: categories
  } = useSelector(state => state.categories);
  const {
    items: pages,
    status: pagesStatus,
    error: pagesLoadError
  } = useSelector(state => state.pages);
  const [pagesBook, setPagesBook] = useState(null);
  const [newPageContent, setNewPageContent] = useState("");
  const [editingPageId, setEditingPageId] = useState(null);
  const [editingPageContent, setEditingPageContent] = useState("");
  const [pagesError, setPagesError] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [wordsPerPage, setWordsPerPage] = useState(300);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(null);
  const bulkFileRef = useRef(null);
  const [tab, setTab] = useState("books");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [newCategory, setNewCategory] = useState("");
  const [inlineCategory, setInlineCategory] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: ""
  });
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [allReviews, setAllReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");
  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchCategories());
  }, [dispatch]);
  useEffect(() => {
    if (tab === "users") {
      setUsersLoading(true);
      setUsersError("");
      api.get("/users").then(res => setAllUsers(res.data)).catch(err => setUsersError(err.response?.data?.error || "Failed to load users")).finally(() => setUsersLoading(false));
    }
    if (tab === "reviews") {
      setReviewsLoading(true);
      setReviewsError("");
      api.get("/reviews").then(res => setAllReviews(res.data)).catch(err => setReviewsError(err.response?.data?.error || "Failed to load reviews")).finally(() => setReviewsLoading(false));
    }
  }, [tab]);
  const handleToggleAdmin = async targetUser => {
    const nextRole = targetUser.role === "admin" ? "user" : "admin";
    if (!window.confirm(`${nextRole === "admin" ? "Grant" : "Revoke"} admin for ${targetUser.name}?`)) return;
    try {
      const res = await api.put(`/users/${targetUser.id}`, {
        role: nextRole
      });
      setAllUsers(list => list.map(u => u.id === targetUser.id ? res.data : u));
    } catch (err) {
      setUsersError(err.response?.data?.error || "Failed to update user");
    }
  };
  const handleDeleteUser = async targetUser => {
    if (targetUser.id === user.id) {
      window.alert("You can't delete your own account here.");
      return;
    }
    if (!window.confirm(`Delete ${targetUser.name}? This can't be undone.`)) return;
    try {
      await api.delete(`/users/${targetUser.id}`);
      setAllUsers(list => list.filter(u => u.id !== targetUser.id));
    } catch (err) {
      setUsersError(err.response?.data?.error || "Failed to delete user");
    }
  };
  const handleDeleteReview = async reviewId => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      setAllReviews(list => list.filter(r => r.id !== reviewId));
    } catch (err) {
      setReviewsError(err.response?.data?.error || "Failed to delete review");
    }
  };
  const visibleUsers = allUsers.filter(u => {
    const q = userSearch.trim().toLowerCase();
    return !q || `${u.name} ${u.email}`.toLowerCase().includes(q);
  });
  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setShowForm(true);
  };
  const openEdit = book => {
    setForm({
      title: book.title,
      author: book.author,
      description: book.description || "",
      category_id: book.category_id,
      total_pages: book.total_pages,
      free_pages: book.free_pages ?? 2,
      price: book.price,
      cover_image: book.cover_image || ""
    });
    setEditingId(book.id);
    setError("");
    setShowForm(true);
  };
  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  const handleFileSelect = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("cover", file);
      const res = await api.post("/books/upload-cover", data, {
        headers: {
          "Content-Type": undefined
        }
      });
      setForm(f => ({
        ...f,
        cover_image: res.data.url
      }));
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.category_id) {
      setError("Pick a category (or add one above) before saving.");
      return;
    }
    if (!form.title.trim() || !form.author.trim()) {
      setError("Title and author are required.");
      return;
    }
    const payload = {
      ...form,
      category_id: Number(form.category_id),
      total_pages: Number(form.total_pages) || 0,
      free_pages: Number(form.free_pages) || 0,
      price: Number(form.price)
    };
    const wasCreating = !editingId;
    const action = editingId ? await dispatch(updateBook({
      id: editingId,
      payload
    })) : await dispatch(createBook(payload));
    if (action.error) {
      setError(action.payload || "Something went wrong");
      return;
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    if (wasCreating) {
      openPages(action.payload);
    }
  };
  const handleDelete = id => {
    if (confirm("Delete this book? This can't be undone.")) {
      dispatch(deleteBook(id));
    }
  };
  const openPages = book => {
    setPagesBook(book);
    setPagesError("");
    setNewPageContent("");
    setEditingPageId(null);
    dispatch(fetchPagesForBook(book.id));
  };
  const closePages = () => {
    setPagesBook(null);
    dispatch(clearPages());
  };
  const handleAddPage = async () => {
    if (!newPageContent.trim()) return;
    const nextNumber = pages.length ? Math.max(...pages.map(p => p.page_number)) + 1 : 1;
    const action = await dispatch(createPage({
      book_id: pagesBook.id,
      page_number: nextNumber,
      content: newPageContent.trim()
    }));
    if (createPage.fulfilled.match(action)) {
      setNewPageContent("");
    } else {
      setPagesError(action.payload || "Failed to add page");
    }
  };
  const splitIntoPages = (text, perPage) => {
    const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    const chunks = [];
    let current = [];
    let currentWords = 0;
    for (const para of paragraphs) {
      const paraWords = para.split(/\s+/).filter(Boolean).length;
      if (currentWords + paraWords > perPage && current.length > 0) {
        chunks.push(current.join("\n\n"));
        current = [];
        currentWords = 0;
      }
      current.push(para);
      currentWords += paraWords;
    }
    if (current.length) chunks.push(current.join("\n\n"));
    return chunks;
  };
  const handleBulkFile = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPagesError("");
    const name = file.name.toLowerCase();
    if (name.endsWith(".pdb")) {
      setPagesError("PalmDOC (.pdb) files are a compressed binary format and can't be read directly. Convert it to .txt or .rtf first (e.g. with Calibre) and upload that instead.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      const raw = ev.target.result;
      const isRtf = name.endsWith(".rtf") || raw.trim().startsWith("{\\rtf");
      setBulkText(isRtf ? rtfToText(raw) : raw);
    };
    reader.readAsText(file);
  };
  const handleBulkImport = async () => {
    if (!bulkText.trim()) return;
    const chunks = splitIntoPages(bulkText, Number(wordsPerPage) || 300);
    if (chunks.length === 0) return;
    if (!confirm(`This will add ${chunks.length} new page${chunks.length === 1 ? "" : "s"} to "${pagesBook.title}". Continue?`)) {
      return;
    }
    setImporting(true);
    setPagesError("");
    let nextNumber = pages.length ? Math.max(...pages.map(p => p.page_number)) + 1 : 1;
    for (let i = 0; i < chunks.length; i++) {
      setImportProgress({
        done: i,
        total: chunks.length
      });
      const action = await dispatch(createPage({
        book_id: pagesBook.id,
        page_number: nextNumber,
        content: chunks[i]
      }));
      if (!createPage.fulfilled.match(action)) {
        setPagesError(`Stopped at page ${i + 1}: ${action.payload || "something went wrong"}`);
        break;
      }
      nextNumber += 1;
    }
    setImportProgress(null);
    setImporting(false);
    setBulkText("");
    if (bulkFileRef.current) bulkFileRef.current.value = "";
  };
  const startEditPage = page => {
    setEditingPageId(page.id);
    setEditingPageContent(page.content);
  };
  const saveEditPage = async () => {
    const action = await dispatch(updatePage({
      id: editingPageId,
      payload: {
        content: editingPageContent
      }
    }));
    if (updatePage.fulfilled.match(action)) {
      setEditingPageId(null);
    } else {
      setPagesError(action.payload || "Failed to save page");
    }
  };
  const handleDeletePage = id => {
    if (confirm("Delete this page? This can't be undone.")) {
      dispatch(deletePage(id));
    }
  };
  const handleAddCategory = async e => {
    e.preventDefault();
    const names = newCategory.split(",").map(n => n.trim()).filter(Boolean);
    if (names.length === 0) return;
    for (const name of names) {
      await dispatch(createCategory({
        name
      }));
    }
    setNewCategory("");
  };
  const handleInlineCategory = async () => {
    const names = inlineCategory.split(",").map(n => n.trim()).filter(Boolean);
    if (names.length === 0) return;
    let firstId = null;
    for (const name of names) {
      const action = await dispatch(createCategory({
        name
      }));
      if (createCategory.fulfilled.match(action) && firstId === null) {
        firstId = action.payload.id;
      }
    }
    if (firstId !== null) {
      setForm(f => ({
        ...f,
        category_id: firstId
      }));
    }
    setInlineCategory("");
  };
  const STARTER_CATEGORIES = ["Action", "Adventure", "Art", "Autobiography", "Biography", "Business", "Children's", "Classic", "Comedy", "Contemporary", "Cookbooks", "Crime", "Drama", "Education", "Essays", "Family", "Fantasy", "Fashion", "Fiction", "Gardening", "Graphic Novel", "Health & Wellness", "Historical Fiction", "History", "Horror", "Humor", "Literary Fiction", "Memoir", "Music", "Mystery", "Mythology", "Nature", "New Adult", "Non-Fiction", "Philosophy", "Photography", "Poetry", "Politics", "Psychology", "Religion", "Romance", "Satire", "Science", "Science Fiction", "Self-Help", "Short Stories", "Sports", "Spirituality", "Technology", "Thriller", "Travel", "True Crime", "War", "Western", "Women's Fiction", "Young Adult", "Coming of Age", "Dystopian", "Epic", "Historical", "Magical Realism", "Paranormal", "Post-Apocalyptic", "Supernatural", "Urban Fantasy", "Mystery & Detective", "Suspense", "Speculative Fiction"];
  const [seedingCategories, setSeedingCategories] = useState(false);
  const handleSeedCategories = async () => {
    setSeedingCategories(true);
    const existingNames = new Set(categories.map(c => c.name.toLowerCase()));
    const toAdd = STARTER_CATEGORIES.filter(name => !existingNames.has(name.toLowerCase()));
    let firstNewId = null;
    for (const name of toAdd) {
      const action = await dispatch(createCategory({
        name
      }));
      if (createCategory.fulfilled.match(action) && firstNewId === null) {
        firstNewId = action.payload.id;
      }
    }
    if (firstNewId !== null) {
      setForm(f => f.category_id ? f : {
        ...f,
        category_id: firstNewId
      });
    }
    setSeedingCategories(false);
  };
  const missingStarterCategories = STARTER_CATEGORIES.filter(name => !categories.some(c => c.name.toLowerCase() === name.toLowerCase()));
  const handleProfileSubmit = async e => {
    e.preventDefault();
    setProfileMsg("");
    setProfileError("");
    const payload = {
      name: profileForm.name,
      email: profileForm.email
    };
    if (profileForm.password) payload.password = profileForm.password;
    const action = await dispatch(updateProfile({
      id: user.id,
      payload
    }));
    if (action.error) {
      setProfileError(action.payload || "Failed to update");
      return;
    }
    setProfileMsg("Saved.");
    setProfileForm(f => ({
      ...f,
      password: ""
    }));
  };
  const categoryName = id => categories.find(c => c.id === id)?.name || "—";
  const coverSrc = path => path?.startsWith("/uploads") ? `${API_ORIGIN}${path}` : path;
  return <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase mb-2 text-gold">Admin</p>
          <h1 className="font-serif italic text-3xl">Manage the catalog</h1>
        </div>
        {tab === "books" && <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium bg-gold text-ink-bg">
            <LuPlus /> Add book
          </button>}
      </div>

      <div className="flex gap-6 mb-8 border-b border-paper-border dark:border-ink-border">
        {["books", "categories", "users", "reviews", "account"].map(t => <button key={t} onClick={() => setTab(t)} className={`pb-3 text-sm capitalize border-b-2 transition ${tab === t ? "border-gold text-gold" : "border-transparent text-paper-sub dark:text-ink-sub"}`}>
            {t}
          </button>)}
      </div>

      {tab === "books" && <div className="rounded-lg border border-paper-border dark:border-ink-border overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-paper-surface dark:bg-ink-surface text-paper-sub dark:text-ink-sub text-left">
              <tr>
                <th className="px-4 py-3 font-normal">Cover</th>
                <th className="px-4 py-3 font-normal">Title</th>
                <th className="px-4 py-3 font-normal">Author</th>
                <th className="px-4 py-3 font-normal">Category</th>
                <th className="px-4 py-3 font-normal">Price</th>
                <th className="px-4 py-3 font-normal">Pages</th>
                <th className="px-4 py-3 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(b => <tr key={b.id} className="border-t border-paper-border dark:border-ink-border">
                  <td className="px-4 py-3">
                    <div className="w-9 h-12 rounded overflow-hidden bg-paper-surface dark:bg-ink-surface flex items-center justify-center shrink-0">
                      {b.cover_image ? <img src={coverSrc(b.cover_image)} alt="" className="w-full h-full object-cover" /> : <LuImage size={14} className="opacity-30" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-serif italic">{b.title}</td>
                  <td className="px-4 py-3 text-paper-sub dark:text-ink-sub">{b.author}</td>
                  <td className="px-4 py-3 text-paper-sub dark:text-ink-sub">{categoryName(b.category_id)}</td>
                  <td className="px-4 py-3">${Number(b.price).toFixed(2)}</td>
                  <td className="px-4 py-3 text-paper-sub dark:text-ink-sub">{b.free_pages} free / {b.total_pages} total</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openPages(b)} className="p-1.5 hover:text-gold transition" aria-label="Manage content">
                        <LuFileText size={16} />
                      </button>
                      <button onClick={() => openEdit(b)} className="p-1.5 hover:text-gold transition" aria-label="Edit">
                        <LuPencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(b.id)} className="p-1.5 hover:text-red-500 transition" aria-label="Delete">
                        <LuTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>)}
              {books.length === 0 && <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-paper-sub dark:text-ink-sub">
                    No books yet. Add your first one.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>}

      {tab === "categories" && <div>
          <form onSubmit={handleAddCategory} className="flex gap-3 mb-4">
            <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New category name (or a few, comma-separated)" aria-label="New category name" className="flex-1 rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 text-sm text-paper-text dark:text-ink-text placeholder:text-paper-sub dark:placeholder:text-ink-sub shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40" />
            <button type="submit" className="px-4 py-2.5 rounded-md text-sm font-medium bg-gold text-ink-bg">
              Add
            </button>
          </form>

          {missingStarterCategories.length > 0 && <div className="border rounded-md p-4 mb-6 border-paper-border dark:border-ink-border bg-paper-surface dark:bg-ink-surface">
              <p className="text-xs text-paper-sub dark:text-ink-sub mb-3">
                {categories.length === 0 ? "Starting from scratch? Add a set of common genres in one click." : `Add ${missingStarterCategories.length} more common genre${missingStarterCategories.length === 1 ? "" : "s"} you don't have yet.`}
              </p>
              <button onClick={handleSeedCategories} disabled={seedingCategories} className="px-4 py-2 rounded-md text-xs font-medium border border-gold text-gold hover:bg-gold hover:text-ink-bg transition disabled:opacity-50">
                {seedingCategories ? "Adding..." : `Add ${missingStarterCategories.slice(0, 3).join(", ")}${missingStarterCategories.length > 3 ? " & more" : ""}`}
              </button>
            </div>}

          <div className="grid sm:grid-cols-3 gap-3">
            {categories.map(c => <div key={c.id} className="p-4 rounded-lg border border-paper-border dark:border-ink-border bg-paper-surface dark:bg-ink-surface">
                <p className="font-serif italic">{c.name}</p>
                {c.description && <p className="text-xs mt-1 text-paper-sub dark:text-ink-sub">{c.description}</p>}
              </div>)}
          </div>
        </div>}

      {tab === "users" && <div>
          <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search by name or email..." aria-label="Search users" className="mb-4 w-full max-w-sm rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 text-sm text-paper-text dark:text-ink-text placeholder:text-paper-sub dark:placeholder:text-ink-sub shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40" />
          {usersError && <p className="text-sm text-red-500 mb-3">{usersError}</p>}
          <div className="rounded-lg border border-paper-border dark:border-ink-border overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead className="bg-paper-surface dark:bg-ink-surface text-paper-sub dark:text-ink-sub text-left">
                <tr>
                  <th className="px-4 py-3 font-normal">Name</th>
                  <th className="px-4 py-3 font-normal">Email</th>
                  <th className="px-4 py-3 font-normal">Role</th>
                  <th className="px-4 py-3 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersLoading && <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-paper-sub dark:text-ink-sub">
                      Loading users...
                    </td>
                  </tr>}
                {!usersLoading && visibleUsers.map(u => <tr key={u.id} className="border-t border-paper-border dark:border-ink-border">
                      <td className="px-4 py-3 font-serif italic">{u.name}</td>
                      <td className="px-4 py-3 text-paper-sub dark:text-ink-sub">{u.email}</td>
                      <td className="px-4 py-3">
                        {u.role === "admin" ? <span className="inline-flex items-center gap-1 text-xs text-gold">
                            <LuShieldCheck size={13} /> Admin
                          </span> : <span className="text-xs text-paper-sub dark:text-ink-sub">User</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => handleToggleAdmin(u)} className="text-xs hover:text-gold transition">
                            {u.role === "admin" ? "Revoke admin" : "Make admin"}
                          </button>
                          <button onClick={() => handleDeleteUser(u)} className="p-1.5 hover:text-red-500 transition" aria-label="Delete user">
                            <LuTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>)}
                {!usersLoading && visibleUsers.length === 0 && <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-paper-sub dark:text-ink-sub">
                      No users found.
                    </td>
                  </tr>}
              </tbody>
            </table>
          </div>
        </div>}

      {tab === "reviews" && <div>
          {reviewsError && <p className="text-sm text-red-500 mb-3">{reviewsError}</p>}
          {reviewsLoading ? <p className="text-sm text-paper-sub dark:text-ink-sub">Loading reviews...</p> : allReviews.length === 0 ? <p className="text-sm text-paper-sub dark:text-ink-sub">No reviews yet.</p> : <div className="space-y-3">
              {allReviews.map(r => <div key={r.id} className="p-4 rounded-lg border border-paper-border dark:border-ink-border bg-paper-surface dark:bg-ink-surface flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-paper-sub dark:text-ink-sub mb-1">
                      <span className="text-gold">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                      <span>{r.user?.name || "Reader"}</span>
                      <span>on</span>
                      <span className="font-serif italic not-italic text-paper-text dark:text-ink-text">
                        {r.book?.title || `Book #${r.book_id}`}
                      </span>
                    </div>
                    {r.comment && <p className="text-sm truncate">{r.comment}</p>}
                  </div>
                  <button onClick={() => handleDeleteReview(r.id)} className="p-1.5 hover:text-red-500 transition shrink-0" aria-label="Delete review">
                    <LuTrash2 size={16} />
                  </button>
                </div>)}
            </div>}
        </div>}

      {tab === "account" && <div className="max-w-sm">
          <p className="text-sm text-paper-sub dark:text-ink-sub mb-6">
            Update the email or password you use to sign in. Leave the password field blank to keep your current one.
          </p>
          <form onSubmit={handleProfileSubmit} className="space-y-3">
            <input value={profileForm.name} onChange={e => setProfileForm({
          ...profileForm,
          name: e.target.value
            })} placeholder="Name" aria-label="Your name" className="w-full rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 text-sm text-paper-text dark:text-ink-text placeholder:text-paper-sub dark:placeholder:text-ink-sub shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40" />
            <input type="email" value={profileForm.email} onChange={e => setProfileForm({
          ...profileForm,
          email: e.target.value
        })} placeholder="Email" aria-label="Your email" className="w-full rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 text-sm text-paper-text dark:text-ink-text placeholder:text-paper-sub dark:placeholder:text-ink-sub shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40" />
            <input type="password" value={profileForm.password} onChange={e => setProfileForm({
          ...profileForm,
          password: e.target.value
        })} placeholder="New password (optional)" aria-label="New password" className="w-full rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 text-sm text-paper-text dark:text-ink-text placeholder:text-paper-sub dark:placeholder:text-ink-sub shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40" />
            {profileError && <p className="text-sm text-red-500">{profileError}</p>}
            {profileMsg && <p className="text-sm text-gold">{profileMsg}</p>}
            <button type="submit" className="w-full py-2.5 rounded-md text-sm font-medium bg-gold text-ink-bg">
              Save changes
            </button>
          </form>
        </div>}

      {showForm && <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-lg border border-paper-border dark:border-ink-border bg-paper-bg dark:bg-ink-bg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-serif italic text-xl">{editingId ? "Edit book" : "Add a book"}</h2>
              <button onClick={() => setShowForm(false)} aria-label="Close">
                <LuX />
              </button>
            </div>

            {!editingId && <div className="flex items-center gap-2 mb-5">
                <span className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full bg-gold text-ink-bg">
                  <span className="w-4 h-4 rounded-full bg-ink-bg text-gold flex items-center justify-center text-[10px]">1</span>
                  Details & cover
                </span>
                <span className="h-px w-4 bg-paper-border dark:bg-ink-border" />
                <span className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full border border-paper-border dark:border-ink-border text-paper-sub dark:text-ink-sub">
                  <span className="w-4 h-4 rounded-full border border-paper-border dark:border-ink-border flex items-center justify-center text-[10px]">2</span>
                  Add content
                </span>
              </div>}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-paper-sub dark:text-ink-sub mb-2">
                  Cover image
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-24 rounded-md overflow-hidden bg-paper-surface dark:bg-ink-surface flex items-center justify-center shrink-0 border border-paper-border dark:border-ink-border">
                    {form.cover_image ? <img src={coverSrc(form.cover_image)} alt="" className="w-full h-full object-cover" /> : <LuImage className="opacity-30" />}
                  </div>
                  <div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} aria-label="Upload book cover image" className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-3 py-2 rounded-md text-xs border border-paper-border dark:border-ink-border hover:border-gold transition disabled:opacity-50">
                      <LuUpload size={14} /> {uploading ? "Uploading..." : "Upload cover"}
                    </button>
                    <p className="text-[11px] text-paper-sub dark:text-ink-sub mt-1.5">
                      JPG or PNG, up to 5MB — this is just the thumbnail, not the book's text.
                    </p>
                  </div>
                </div>
              </div>

              <input name="title" placeholder="Title" aria-label="Book title" required value={form.title} onChange={handleChange} className="w-full rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 text-sm text-paper-text dark:text-ink-text placeholder:text-paper-sub dark:placeholder:text-ink-sub shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40" />
              <input name="author" placeholder="Author" aria-label="Author name" required value={form.author} onChange={handleChange} className="w-full rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 text-sm text-paper-text dark:text-ink-text placeholder:text-paper-sub dark:placeholder:text-ink-sub shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40" />
              <textarea name="description" placeholder="Description" aria-label="Book description" rows={3} value={form.description} onChange={handleChange} className="w-full rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 text-sm text-paper-text dark:text-ink-text placeholder:text-paper-sub dark:placeholder:text-ink-sub shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40 resize-none" />
              {categories.length === 0 ? <div className="border rounded-md p-3 border-paper-border dark:border-ink-border bg-paper-surface dark:bg-ink-surface">
                  <p className="text-xs text-paper-sub dark:text-ink-sub mb-2">
                    No categories yet — add one to continue.
                  </p>
                  <div className="flex gap-2 mb-2">
                    <input value={inlineCategory} onChange={e => setInlineCategory(e.target.value)} placeholder="Fantasy, Adventure, Sci-Fi..." aria-label="New category name" className="flex-1 rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 text-sm text-paper-text dark:text-ink-text placeholder:text-paper-sub dark:placeholder:text-ink-sub shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40" />
                    <button type="button" onClick={handleInlineCategory} className="px-3 py-2 rounded-md text-xs font-medium bg-gold text-ink-bg shrink-0">
                      Add
                    </button>
                  </div>
                  <button type="button" onClick={handleSeedCategories} disabled={seedingCategories} className="text-xs text-gold hover:underline disabled:opacity-50">
                    {seedingCategories ? "Adding..." : "or add Fantasy, Adventure, Sci-Fi & more"}
                  </button>
                </div> : <div>
                  <select name="category_id" required value={form.category_id} onChange={handleChange} aria-label="Book category" className="w-full rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 text-sm text-paper-text dark:text-ink-text shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {missingStarterCategories.length > 0 && <button type="button" onClick={handleSeedCategories} disabled={seedingCategories} className="text-xs text-gold hover:underline mt-1.5 disabled:opacity-50">
                      {seedingCategories ? "Adding..." : "+ add more common genres"}
                    </button>}
                </div>}
              <div className="grid grid-cols-3 gap-3">
                <input name="total_pages" type="number" min="0" placeholder="Total pages (optional)" aria-label="Total pages" value={form.total_pages} onChange={handleChange} className="min-w-0 rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-3 py-3 text-sm text-paper-text dark:text-ink-text placeholder:text-paper-sub dark:placeholder:text-ink-sub shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40" />
                <input name="free_pages" type="number" min="0" placeholder="Free pages" aria-label="Free pages before locking" value={form.free_pages} onChange={handleChange} className="min-w-0 rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-3 py-3 text-sm text-paper-text dark:text-ink-text placeholder:text-paper-sub dark:placeholder:text-ink-sub shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40" />
                <input name="price" type="number" min="0" step="0.01" placeholder="Price" aria-label="Price" required value={form.price} onChange={handleChange} className="min-w-0 rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-3 py-3 text-sm text-paper-text dark:text-ink-text placeholder:text-paper-sub dark:placeholder:text-ink-sub shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40" />
              </div>
              <p className="text-xs text-paper-sub dark:text-ink-sub -mt-1">
                "Free pages" is how many pages readers can open before the rest locks. Add the actual chapters after saving, from the content icon on the book's row.
              </p>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button type="submit" className="w-full py-2.5 rounded-md text-sm font-medium bg-gold text-ink-bg mt-2">
                {editingId ? "Save changes" : "Create book \u2192 add content"}
              </button>
              {!editingId && <p className="text-[11px] text-center text-paper-sub dark:text-ink-sub">
                  Next you'll write or upload the book's actual pages.
                </p>}
            </form>
          </div>
        </div>}

      {pagesBook && <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-lg border border-paper-border dark:border-ink-border bg-paper-bg dark:bg-ink-bg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-serif italic text-xl">{pagesBook.title}</h2>
              <button onClick={closePages} aria-label="Close">
                <LuX />
              </button>
            </div>
            {pages.length === 0 && <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full bg-gold text-ink-bg mb-3">
                <span className="w-4 h-4 rounded-full bg-ink-bg text-gold flex items-center justify-center text-[10px]">2</span>
                Add content
              </span>}
            <p className="text-xs text-paper-sub dark:text-ink-sub mb-6">
              {pages.length === 0 ? "Book details are saved — now write or import its pages below." : `${pages.length} page${pages.length === 1 ? "" : "s"} written so far`}
            </p>

            {pagesStatus === "loading" && <p className="text-sm text-paper-sub dark:text-ink-sub">Loading pages...</p>}
            {pagesStatus === "failed" && <p className="text-sm text-red-500 mb-4">{pagesLoadError || "Failed to load pages."}</p>}

            <div className="space-y-3 mb-6">
              {pages.map(p => <div key={p.id} className="border rounded-md p-4 border-paper-border dark:border-ink-border bg-paper-surface dark:bg-ink-surface">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gold">Page {p.page_number}</span>
                    <div className="flex items-center gap-2">
                      {editingPageId === p.id ? <>
                          <button onClick={saveEditPage} className="text-xs text-gold hover:underline">Save</button>
                          <button onClick={() => setEditingPageId(null)} className="text-xs text-paper-sub dark:text-ink-sub hover:underline">Cancel</button>
                        </> : <>
                          <button onClick={() => startEditPage(p)} className="p-1 hover:text-gold transition" aria-label="Edit page">
                            <LuPencil size={13} />
                          </button>
                          <button onClick={() => handleDeletePage(p.id)} className="p-1 hover:text-red-500 transition" aria-label="Delete page">
                            <LuTrash2 size={13} />
                          </button>
                        </>}
                    </div>
                  </div>
                  {editingPageId === p.id ? <textarea value={editingPageContent} onChange={e => setEditingPageContent(e.target.value)} aria-label={`Edit content for page ${p.page_number}`} rows={5} className="w-full rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 text-sm text-paper-text dark:text-ink-text shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40 resize-none" /> : <p className="text-sm leading-relaxed whitespace-pre-wrap">{p.content}</p>}
                </div>)}
              {pages.length === 0 && pagesStatus !== "loading" && <p className="text-sm text-paper-sub dark:text-ink-sub">
                  No pages yet. Write the first one below.
                </p>}
            </div>

            <div className="border-t border-paper-border dark:border-ink-border pt-5 mb-6">
              <p className="text-xs font-medium mb-1 text-gold">Import a whole book</p>
              <p className="text-xs text-paper-sub dark:text-ink-sub mb-3">
                Upload a .txt or .rtf file, or paste the full text — it'll be split into pages automatically, roughly every {wordsPerPage} words at a paragraph break.
              </p>

              <div className="flex items-center gap-3 mb-3">
                <input ref={bulkFileRef} type="file" accept=".txt,.rtf,text/plain,application/rtf" onChange={handleBulkFile} aria-label="Upload book text file" className="hidden" />
                <button type="button" onClick={() => bulkFileRef.current?.click()} className="flex items-center gap-2 px-3 py-2 rounded-md text-xs border border-paper-border dark:border-ink-border hover:border-gold transition">
                  <LuUpload size={13} /> Upload .txt or .rtf
                </button>
                <div className="flex items-center gap-2 text-xs text-paper-sub dark:text-ink-sub">
                  <span>Words per page</span>
                  <input type="number" min="50" step="50" value={wordsPerPage} onChange={e => setWordsPerPage(e.target.value)} aria-label="Words per page" className="w-20 rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-3 py-2 text-sm text-paper-text dark:text-ink-text shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40" />
                </div>
              </div>

              <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} placeholder="Or paste the entire book text here..." aria-label="Full book text to import" rows={5} className="mb-2 w-full rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 text-sm text-paper-text dark:text-ink-text placeholder:text-paper-sub dark:placeholder:text-ink-sub shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40 resize-none" />

              {bulkText.trim() && !importing && <p className="text-xs text-paper-sub dark:text-ink-sub mb-2">
                  ~{splitIntoPages(bulkText, Number(wordsPerPage) || 300).length} pages will be created
                </p>}

              {importing && importProgress && <p className="text-xs text-gold mb-2">
                  Adding page {importProgress.done + 1} of {importProgress.total}...
                </p>}

              <button type="button" onClick={handleBulkImport} disabled={!bulkText.trim() || importing} className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium border border-gold text-gold hover:bg-gold hover:text-ink-bg transition disabled:opacity-40">
                <LuFileText size={15} /> {importing ? "Importing..." : "Split and import"}
              </button>
            </div>

            <div className="border-t border-paper-border dark:border-ink-border pt-5">
              <p className="text-xs font-medium mb-2 text-gold">
                Page {pages.length ? Math.max(...pages.map(p => p.page_number)) + 1 : 1}
              </p>
              <textarea value={newPageContent} onChange={e => setNewPageContent(e.target.value)} placeholder="Write this page's content..." aria-label="New page content" rows={6} className="mb-2 w-full rounded-xl border border-paper-border dark:border-ink-border bg-paper-surface/50 dark:bg-ink-surface/50 px-4 py-3 text-sm text-paper-text dark:text-ink-text placeholder:text-paper-sub dark:placeholder:text-ink-sub shadow-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/40 resize-none" />
              {pagesError && <p className="text-sm text-red-500 mb-2">{pagesError}</p>}
              <button onClick={handleAddPage} className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium bg-gold text-ink-bg">
                <LuPlus size={15} /> Add page
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
export default Admin;
