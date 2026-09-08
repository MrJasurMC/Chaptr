import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
export const fetchRecentlyViewed = createAsyncThunk("recentlyViewed/fetch", async (userId, {
  rejectWithValue
}) => {
  try {
    const res = await api.get(`/recently-viewed/user/${userId}`, {
      params: {
        limit: 12
      }
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to load recently viewed");
  }
});
export const recordView = createAsyncThunk("recentlyViewed/record", async ({
  userId,
  bookId
}, {
  rejectWithValue
}) => {
  try {
    const res = await api.post("/recently-viewed", {
      user_id: userId,
      book_id: bookId
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to record view");
  }
});
export const clearHistory = createAsyncThunk("recentlyViewed/clear", async (userId, {
  rejectWithValue
}) => {
  try {
    await api.delete(`/recently-viewed/user/${userId}`);
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to clear history");
  }
});
const recentlyViewedSlice = createSlice({
  name: "recentlyViewed",
  initialState: {
    items: [],
    status: "idle",
    error: null
  },
  reducers: {
    clearRecentlyViewedState(state) {
      state.items = [];
      state.status = "idle";
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchRecentlyViewed.pending, state => {
      state.status = "loading";
    }).addCase(fetchRecentlyViewed.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.items = action.payload;
    }).addCase(fetchRecentlyViewed.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    }).addCase(clearHistory.fulfilled, state => {
      state.items = [];
    });
  }
});
export const {
  clearRecentlyViewedState
} = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;
