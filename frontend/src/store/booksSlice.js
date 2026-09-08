import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
export const fetchBooks = createAsyncThunk("books/fetchBooks", async (_, {
  rejectWithValue
}) => {
  try {
    const res = await api.get("/books");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to load books");
  }
});
export const fetchBookById = createAsyncThunk("books/fetchBookById", async (id, {
  rejectWithValue
}) => {
  try {
    const res = await api.get(`/books/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to load book");
  }
});
export const createBook = createAsyncThunk("books/createBook", async (payload, {
  rejectWithValue
}) => {
  try {
    const res = await api.post("/books", payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to create book");
  }
});
export const updateBook = createAsyncThunk("books/updateBook", async ({
  id,
  payload
}, {
  rejectWithValue
}) => {
  try {
    const res = await api.put(`/books/${id}`, payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to update book");
  }
});
export const deleteBook = createAsyncThunk("books/deleteBook", async (id, {
  rejectWithValue
}) => {
  try {
    await api.delete(`/books/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to delete book");
  }
});
const booksSlice = createSlice({
  name: "books",
  initialState: {
    items: [],
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchBooks.pending, state => {
      state.status = "loading";
    }).addCase(fetchBooks.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.items = action.payload;
    }).addCase(fetchBooks.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    }).addCase(createBook.fulfilled, (state, action) => {
      state.items.push(action.payload);
    }).addCase(fetchBookById.fulfilled, (state, action) => {
      const idx = state.items.findIndex(b => b.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;else state.items.push(action.payload);
    }).addCase(updateBook.fulfilled, (state, action) => {
      const idx = state.items.findIndex(b => b.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    }).addCase(deleteBook.fulfilled, (state, action) => {
      state.items = state.items.filter(b => b.id !== action.payload);
    });
  }
});
export default booksSlice.reducer;
