import { createSlice } from "@reduxjs/toolkit";

const playlistsSlice = createSlice({
  name: "playlists",
  initialState: { items: [], status: "idle", error: "" },
  reducers: {
    setPlaylistsLoading: (state) => {
      state.status = "loading";
      state.error = "";
    },
    setPlaylists: (state, action) => {
      state.items = action.payload;
      state.status = "succeeded";
      state.error = "";
    },
    setPlaylistsError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    addPlaylist: (state, action) => {
      state.items.unshift(action.payload);
    },
    updatePlaylist: (state, action) => {
      const index = state.items.findIndex(
        (playlist) => (playlist.id || playlist._id) === action.payload.id,
      );
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.changes };
      }
    },
    removePlaylist: (state, action) => {
      state.items = state.items.filter(
        (playlist) => (playlist.id || playlist._id) !== action.payload,
      );
    },
  },
});

export const {
  addPlaylist,
  removePlaylist,
  setPlaylists,
  setPlaylistsError,
  setPlaylistsLoading,
  updatePlaylist,
} = playlistsSlice.actions;
export default playlistsSlice.reducer;