import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
export const fetchFavorites = createAsyncThunk("favorites/fetchFavorites", async (userId, {
  rejectWithValue
}) => {
  try {
    const res = await api.get(`/favorites/user/${userId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to load favorites");
  }
});
export const addFavorite = createAsyncThunk("favorites/addFavorite", async ({
  userId,
  bookId
}, {
  rejectWithValue
}) => {
  try {
    const res = await api.post("/favorites", {
      user_id: userId,
      book_id: bookId
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to add favorite");
  }
});
export const removeFavorite = createAsyncThunk("favorites/removeFavorite", async ({
  userId,
  bookId
}, {
  rejectWithValue
}) => {
  try {
    await api.delete(`/favorites/user/${userId}/book/${bookId}`);
    return bookId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to remove favorite");
  }
});
const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
    status: "idle",
    error: null
  },
  reducers: {
    clearFavorites(state) {
      state.items = [];
      state.status = "idle";
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchFavorites.pending, state => {
      state.status = "loading";
    }).addCase(fetchFavorites.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.items = action.payload;
    }).addCase(fetchFavorites.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    }).addCase(addFavorite.fulfilled, (state, action) => {
      const exists = state.items.some(f => f.book_id === action.payload.book_id);
      if (!exists) state.items.unshift(action.payload);
    }).addCase(removeFavorite.fulfilled, (state, action) => {
      state.items = state.items.filter(f => f.book_id !== action.payload);
    });
  }
});
export const {
  clearFavorites
} = favoritesSlice.actions;
export default favoritesSlice.reducer;
