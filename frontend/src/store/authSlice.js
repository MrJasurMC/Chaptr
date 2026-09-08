import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
export const loginUser = createAsyncThunk("auth/login", async (credentials, {
  rejectWithValue
}) => {
  try {
    const res = await api.post("/users/login", credentials);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Login failed");
  }
});
export const registerUser = createAsyncThunk("auth/register", async (payload, {
  rejectWithValue
}) => {
  try {
    const res = await api.post("/users", payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Registration failed");
  }
});
export const googleLogin = createAsyncThunk("auth/googleLogin", async (credential, {
  rejectWithValue
}) => {
  try {
    const res = await api.post("/users/google", {
      credential
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Google sign-in failed");
  }
});
export const updateProfile = createAsyncThunk("auth/updateProfile", async ({
  id,
  payload
}, {
  rejectWithValue
}) => {
  try {
    const res = await api.put(`/users/${id}`, payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Failed to update profile");
  }
});
const initialState = {
  user: JSON.parse(localStorage.getItem("chaptr-user")) || null,
  status: "idle",
  error: null
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem("chaptr-user");
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder.addCase(loginUser.pending, state => {
      state.status = "loading";
      state.error = null;
    }).addCase(loginUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload;
      localStorage.setItem("chaptr-user", JSON.stringify(action.payload));
    }).addCase(loginUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    }).addCase(registerUser.pending, state => {
      state.status = "loading";
      state.error = null;
    }).addCase(registerUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload;
      localStorage.setItem("chaptr-user", JSON.stringify(action.payload));
    }).addCase(registerUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    }).addCase(googleLogin.pending, state => {
      state.status = "loading";
      state.error = null;
    }).addCase(googleLogin.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload;
      localStorage.setItem("chaptr-user", JSON.stringify(action.payload));
    }).addCase(googleLogin.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    }).addCase(updateProfile.fulfilled, (state, action) => {
        state.user = {
          ...action.payload,
          token: state.user?.token
        };
        localStorage.setItem("chaptr-user", JSON.stringify(state.user));
    });
  }
});
export const {
  logout,
  clearError
} = authSlice.actions;
export default authSlice.reducer;
