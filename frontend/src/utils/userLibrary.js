const likesKey = userId => `chaptr-likes-${userId}`;
const recentKey = userId => `chaptr-recent-${userId}`;
const interestsKey = userId => `chaptr-interests-${userId}`;
const readList = key => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const writeList = (key, list) => {
  localStorage.setItem(key, JSON.stringify(list));
};
export function getLikedBooks(userId) {
  if (!userId) return [];
  return readList(likesKey(userId));
}
export function isBookLiked(userId, bookId) {
  if (!userId) return false;
  return getLikedBooks(userId).some(b => b.id === bookId);
}
export function toggleLikedBook(userId, book) {
  if (!userId) return false;
  const key = likesKey(userId);
  const list = readList(key);
  const idx = list.findIndex(b => b.id === book.id);
  if (idx !== -1) {
    list.splice(idx, 1);
    writeList(key, list);
    return false;
  }
  list.unshift({
    id: book.id,
    title: book.title,
    author: book.author,
    cover_image: book.cover_image
  });
  writeList(key, list.slice(0, 50));
  return true;
}
export function getRecentBooks(userId) {
  if (!userId) return [];
  return readList(recentKey(userId));
}
export function addRecentBook(userId, book) {
  if (!userId) return;
  const key = recentKey(userId);
  const list = readList(key).filter(b => b.id !== book.id);
  list.unshift({
    id: book.id,
    title: book.title,
    author: book.author,
    cover_image: book.cover_image,
    viewedAt: new Date().toISOString()
  });
  writeList(key, list.slice(0, 12));
}
export function getInterests(userId) {
  if (!userId) return [];
  return readList(interestsKey(userId));
}
export function setInterests(userId, categoryIds) {
  if (!userId) return;
  writeList(interestsKey(userId), categoryIds);
}
