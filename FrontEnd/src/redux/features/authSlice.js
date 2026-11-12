import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCurrentUserApi,
  loginApi,
  registerApi,
} from "../../services/authServices.js";

const getApiError = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

const createSession = (response) => {
  const token = response?.token;
  const user = response?.data?.user;

  if (!token || !user) {
    throw new Error("La API devolvió una respuesta de autenticación incompleta.");
  }

  window.localStorage.setItem("token", token);
  return { token, user };
};

const savedToken = window.localStorage.getItem("token");

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return createSession(await loginApi(credentials));
    } catch (error) {
      return rejectWithValue(getApiError(error, "No se pudo iniciar sesión."));
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      return createSession(await registerApi(userData));
    } catch (error) {
      return rejectWithValue(getApiError(error, "No se pudo crear la cuenta."));
    }
  },
);

export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUserApi();
      const user = response?.data?.user;

      if (!user) {
        throw new Error("La API no devolvió los datos del usuario.");
      }

      return { token: window.localStorage.getItem("token"), user };
    } catch (error) {
      window.localStorage.removeItem("token");
      return rejectWithValue(getApiError(error, "La sesión ya no es válida."));
    }
  },
  {
    condition: (_, { getState }) =>
      Boolean(window.localStorage.getItem("token")) &&
      !getState().auth.restoreRequested,
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: savedToken,
    user: null,
    status: "idle",
    error: null,
    restoring: Boolean(savedToken),
    restoreRequested: false,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
      state.restoring = false;
      state.restoreRequested = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    updateAuthToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(restoreSession.pending, (state) => {
        state.restoring = true;
        state.restoreRequested = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.restoring = false;
        state.restoreRequested = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.restoring = false;
        state.restoreRequested = false;
        state.token = null;
        state.user = null;
      });
  },
});

export const { clearAuthError, logout, updateAuthToken } = authSlice.actions;
export default authSlice.reducer;
