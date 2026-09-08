import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
export const fetchPagesForBook = createAsyncThunk("pages/fetchPagesForBook", async (bookId, {
  rejectWithValue
}) => {
  try {
    const res = await api.get(`/pages/book/${bookId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to load pages");
  }
});
export const createPage = createAsyncThunk("pages/createPage", async (payload, {
  rejectWithValue
}) => {
  try {
    const res = await api.post("/pages", payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to add page");
  }
});
export const updatePage = createAsyncThunk("pages/updatePage", async ({
  id,
  payload
}, {
  rejectWithValue
}) => {
  try {
    const res = await api.put(`/pages/${id}`, payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to update page");
  }
});
export const deletePage = createAsyncThunk("pages/deletePage", async (id, {
  rejectWithValue
}) => {
  try {
    await api.delete(`/pages/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to delete page");
  }
});
const pagesSlice = createSlice({
  name: "pages",
  initialState: {
    items: [],
    status: "idle",
    error: null
  },
  reducers: {
    clearPages(state) {
      state.items = [];
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchPagesForBook.pending, state => {
      state.status = "loading";
      state.error = null;
    }).addCase(fetchPagesForBook.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.items = action.payload;
    }).addCase(fetchPagesForBook.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    }).addCase(createPage.fulfilled, (state, action) => {
      state.items.push(action.payload);
      state.items.sort((a, b) => a.page_number - b.page_number);
    }).addCase(updatePage.fulfilled, (state, action) => {
      const idx = state.items.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    }).addCase(deletePage.fulfilled, (state, action) => {
      state.items = state.items.filter(p => p.id !== action.payload);
    });
  }
});
export const {
  clearPages
} = pagesSlice.actions;
export default pagesSlice.reducer;
