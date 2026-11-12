import api from "./authServices.js";

export const getPlaylistsApi = async (signal) => {
  const response = await api.get("/playlists?limit=100", { signal });
  return response.data?.data?.playlists;
};

export const getGenresApi = async (signal) => {
  const response = await api.get("/genres?limit=100", { signal });
  return response.data?.data?.genres;
};

export const createPlaylistApi = async (playlist) => {
  const response = await api.post("/playlists", playlist);
  return response.data?.data?.playlist;
};

export const updatePlaylistApi = async (id, changes) => {
  const response = await api.patch(`/playlists/${id}`, changes);
  return response.data?.data?.playlist;
};

export const deletePlaylistApi = async (id) => {
  await api.delete(`/playlists/${id}`);
};

export const uploadPlaylistCoverApi = async (id, image) => {
  const formData = new FormData();
  formData.append("image", image);
  const response = await api.post(`/playlists/${id}/cover-image`, formData);
  return response.data?.data?.playlist;
};

export const addTrackApi = async (id, track) => {
  const response = await api.post(`/playlists/${id}/tracks`, track);
  return response.data?.data?.playlist;
};

export const removeTrackApi = async (playlistId, trackId) => {
  const response = await api.delete(
    `/playlists/${playlistId}/tracks/${trackId}`,
  );
  return response.data?.data?.playlist;
};

export const generatePlaylistVibeApi = async (id) => {
  const response = await api.post(`/playlists/${id}/generate-vibe`);
  return response.data?.data;
};

export const searchTracksApi = async (query) => {
  const response = await api.get("/tracks/search", { params: { q: query } });
  return response.data?.data?.tracks;
};