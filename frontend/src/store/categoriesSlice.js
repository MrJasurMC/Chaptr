import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
export const fetchCategories = createAsyncThunk("categories/fetchCategories", async (_, {
  rejectWithValue
}) => {
  try {
    const res = await api.get("/categories");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to load categories");
  }
});
export const createCategory = createAsyncThunk("categories/createCategory", async (payload, {
  rejectWithValue
}) => {
  try {
    const res = await api.post("/categories", payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to create category");
  }
});
const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.items = action.payload;
    }).addCase(createCategory.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
  }
});
export default categoriesSlice.reducer;
