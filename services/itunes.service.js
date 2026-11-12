// API pública de iTunes — sin clave, sin límite de uso significativo.
// Cumple el requisito de "recurso de terceros pertinente al dominio".
export const searchTracks = async (term, limit = 10) => {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`iTunes respondió con estado ${response.status}`);
  }

  const data = await response.json();

  return (data.results || []).map((track) => ({
    title: track.trackName,
    artist: track.artistName,
    album: track.collectionName || '',
    durationMs: track.trackTimeMillis || 0,
    previewUrl: track.previewUrl || '',
    artworkUrl: track.artworkUrl100 || '',
  }));
};
