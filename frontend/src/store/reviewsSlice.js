import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
export const fetchReviewsByBook = createAsyncThunk("reviews/fetchReviewsByBook", async (bookId, {
  rejectWithValue
}) => {
  try {
    const res = await api.get(`/reviews/book/${bookId}`);
    return {
      bookId,
      reviews: res.data
    };
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to load reviews");
  }
});
export const createReview = createAsyncThunk("reviews/createReview", async (payload, {
  rejectWithValue
}) => {
  try {
    const res = await api.post("/reviews", payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to create review");
  }
});
export const updateReview = createAsyncThunk("reviews/updateReview", async ({
  id,
  payload
}, {
  rejectWithValue
}) => {
  try {
    const res = await api.put(`/reviews/${id}`, payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to update review");
  }
});
export const deleteReview = createAsyncThunk("reviews/deleteReview", async (id, {
  rejectWithValue
}) => {
  try {
    await api.delete(`/reviews/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to delete review");
  }
});
const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    items: [],
    status: "idle",
    error: null
  },
  reducers: {
    clearReviewError(state) {
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchReviewsByBook.pending, state => {
      state.status = "loading";
      state.error = null;
    }).addCase(fetchReviewsByBook.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.items = action.payload.reviews;
    }).addCase(fetchReviewsByBook.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    }).addCase(createReview.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    }).addCase(createReview.rejected, (state, action) => {
      state.error = action.payload;
    }).addCase(updateReview.fulfilled, (state, action) => {
      const idx = state.items.findIndex(r => r.id === action.payload.id);
      if (idx !== -1) state.items[idx] = {
        ...state.items[idx],
        ...action.payload
      };
    }).addCase(updateReview.rejected, (state, action) => {
      state.error = action.payload;
    }).addCase(deleteReview.fulfilled, (state, action) => {
      state.items = state.items.filter(r => r.id !== action.payload);
    }).addCase(deleteReview.rejected, (state, action) => {
      state.error = action.payload;
    });
  }
});
export const {
  clearReviewError
} = reviewsSlice.actions;
export default reviewsSlice.reducer;
