import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePlaylist } from "../redux/features/playlistsSlice.js";
import { addTrackApi, searchTracksApi } from "../services/playlistServices.js";

const getId = (item) => item?.id || item?._id;
const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "No se pudo completar la operación.";

export default function DiscoverTracks() {
  const dispatch = useDispatch();
  const playlists = useSelector((state) => state.playlists.items);
  const [query, setQuery] = useState("");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const selectedPlaylist = playlists.find(
    (playlist) => getId(playlist) === selectedPlaylistId,
  ) || playlists[0];

  const search = async (event) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) {
      setError("Escribí un artista o una canción para buscar.");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");
    try {
      const tracks = await searchTracksApi(term);
      if (!Array.isArray(tracks) || tracks.some((track) => !track.title || !track.artist)) {
        throw new Error("La API devolvió resultados de búsqueda inválidos.");
      }
      setResults(tracks);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  const addTrack = async (track, index) => {
    if (!selectedPlaylist) {
      setError("Primero creá una playlist para agregar canciones.");
      return;
    }

    const playlistId = getId(selectedPlaylist);
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const updatedPlaylist = await addTrackApi(playlistId, track);
      if (
        getId(updatedPlaylist) !== playlistId ||
        !Array.isArray(updatedPlaylist.tracks)
      ) {
        throw new Error("La API no confirmó la canción agregada.");
      }
      dispatch(updatePlaylist({ id: playlistId, changes: updatedPlaylist }));
      setResults((current) => current.filter((_, resultIndex) => resultIndex !== index));
      setNotice(`“${track.title}” se agregó a ${selectedPlaylist.name}.`);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="discover-panel" aria-labelledby="discover-title">
      <div className="discover-heading">
        <div>
          <p className="eyebrow">PARA DESCUBRIR</p>
          <h2 id="discover-title">Encontrá música nueva</h2>
        </div>
        <p>Buscá en iTunes y sumá canciones a tus playlists.</p>
      </div>

      <form className="discover-form" onSubmit={search}>
        <label>
          Artista o canción
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Por ejemplo, nombre de artista o canción"
            required
          />
        </label>
        <label>
          Agregar a
          <select
            value={getId(selectedPlaylist) || ""}
            onChange={(event) => setSelectedPlaylistId(event.target.value)}
            disabled={!playlists.length}
          >
            {!playlists.length && <option value="">Creá una playlist primero</option>}
            {playlists.map((playlist) => (
              <option key={getId(playlist)} value={getId(playlist)}>
                {playlist.name}
              </option>
            ))}
          </select>
        </label>
        <button className="button button-primary" type="submit" disabled={busy}>
          {busy ? "Buscando..." : "Buscar canciones"}
        </button>
      </form>

      {error && <p className="form-alert" role="alert">{error}</p>}
      {notice && <p className="form-success" role="status">{notice}</p>}
      {results.length > 0 && (
        <div className="discover-results" aria-live="polite">
          {results.map((track, index) => (
            <article className="discover-track" key={`${track.title}-${track.artist}-${index}`}>
              {track.artworkUrl ? (
                <img src={track.artworkUrl} alt={`Portada de ${track.album || track.title}`} />
              ) : (
                <div className="discover-artwork-empty" aria-hidden="true">♫</div>
              )}
              <div className="discover-track-info">
                <strong>{track.title}</strong>
                <span>{track.artist}{track.album ? ` · ${track.album}` : ""}</span>
              </div>
              <button
                className="button button-quiet"
                type="button"
                disabled={busy || !selectedPlaylist}
                onClick={() => addTrack(track, index)}
              >
                Agregar
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}