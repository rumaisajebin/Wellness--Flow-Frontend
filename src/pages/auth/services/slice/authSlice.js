import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signup as signupAPI,
  login as loginAPI,
  fetchProfile as ProfileAPI,
  updateProfile as ProfileUpdateAPI,
} from "../../services/Api";

const initialState = {
  username: "",
  email: "",
  password: "",
  status: "idle",
  error: null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  access: JSON.parse(localStorage.getItem("access")) || null,
  refresh: JSON.parse(localStorage.getItem("refresh")) || null,
  isLogged: JSON.parse(localStorage.getItem("isLogged") || false),
  role: JSON.parse(localStorage.getItem("role") || null),
};

// Async action to fetch user profile
export const ProfileSelect = createAsyncThunk(
  "auth/fetchProfile",
  async (token, thunkAPI) => {
    try {
      const response = await ProfileAPI(token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async action to update user profile
export const ProfileUpdate = createAsyncThunk(
  "auth/updateProfile",
  async ({ updatedData, access }, thunkAPI) => {
    try {
      const response = await ProfileUpdateAPI(updatedData, access);
      console.log(response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Existing async actions for signup and login
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData, thunkAPI) => {
    try {
      const response = await signupAPI(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/signin",
  async (credentials, thunkAPI) => {
    try {
      const response = await loginAPI(credentials);
      return response;
    } catch (error) {
      
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    logout: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.isLogged = false;
      state.role = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle signup
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Optionally, clear form data or set user data here
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.role !== "" ? action.payload.role : "admin";
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.isLogged = true;
        state.role = action.payload.role !== "" ? action.payload.role : "admin";
        localStorage.setItem(
          "user",
          JSON.stringify(action.payload.role ? action.payload.role : "admin")
        );
        localStorage.setItem("access", JSON.stringify(action.payload.access));
        localStorage.setItem("refresh", JSON.stringify(action.payload.refresh));
        localStorage.setItem("isLogged", JSON.stringify(state.isLogged));
        localStorage.setItem("role", JSON.stringify(state.role));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle fetch profile
      .addCase(ProfileSelect.pending, (state) => {
        state.status = "loading";
      })
      .addCase(ProfileSelect.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(ProfileSelect.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle update profile
      .addCase(ProfileUpdate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(ProfileUpdate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(ProfileUpdate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { updateField, logout } = authSlice.actions;
export default authSlice.reducer;
