import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPlaylist,
  removePlaylist,
  updatePlaylist,
} from "../redux/features/playlistsSlice.js";
import {
  addTrackApi,
  createPlaylistApi,
  deletePlaylistApi,
  generatePlaylistVibeApi,
  removeTrackApi,
  searchTracksApi,
  updatePlaylistApi,
  uploadPlaylistCoverApi,
} from "../services/playlistServices.js";

const emptyDraft = { name: "", description: "", genre: "", isPublic: true };
const getId = (item) => item?.id || item?._id;
const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.errors?.[0]?.message ||
  error.message ||
  "No se pudo completar la operación.";

const hasPlaylist = (playlist) => Boolean(getId(playlist) && playlist.name);

export default function PlaylistLibrary({ onChange }) {
  const dispatch = useDispatch();
  const playlists = useSelector((state) => state.playlists.items);
  const status = useSelector((state) => state.playlists.status);
  const loadError = useSelector((state) => state.playlists.error);
  const genres = useSelector((state) => state.genres);
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState("");
  const [filter, setFilter] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [trackDrafts, setTrackDrafts] = useState({});
  const [trackQueries, setTrackQueries] = useState({});
  const [trackResults, setTrackResults] = useState({});

  const visiblePlaylists = useMemo(() => {
    const query = filter.trim().toLocaleLowerCase();
    return playlists.filter((playlist) => {
      const genreName = typeof playlist.genre === "object"
        ? playlist.genre?.name
        : genres.find((genre) => getId(genre) === playlist.genre)?.name;
      return !query || `${playlist.name} ${playlist.description || ""} ${genreName || ""}`
        .toLocaleLowerCase()
        .includes(query);
    });
  }, [filter, genres, playlists]);

  const setField = (field, value) =>
    setDraft((current) => ({ ...current, [field]: value }));

  const savePlaylist = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!draft.name.trim() || !draft.genre) {
      setError("Ingresá un nombre y seleccioná un género.");
      return;
    }
    if (draft.name.trim().length > 100 || draft.description.length > 500) {
      setError("El nombre admite hasta 100 caracteres y la descripción hasta 500.");
      return;
    }

    setBusy("save");
    try {
      const payload = {
        ...draft,
        name: draft.name.trim(),
        description: draft.description.trim(),
      };
      if (editingId) {
        const updated = await updatePlaylistApi(editingId, payload);
        if (!hasPlaylist(updated)) throw new Error("La API no confirmó la playlist actualizada.");
        dispatch(updatePlaylist({ id: editingId, changes: updated }));
        setNotice("Playlist actualizada.");
        setEditingId("");
      } else {
        const created = await createPlaylistApi(payload);
        if (!hasPlaylist(created)) throw new Error("La API no devolvió la playlist creada.");
        dispatch(addPlaylist(created));
        setNotice("Playlist creada.");
        setDraft(emptyDraft);
        onChange?.();
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy("");
    }
  };

  const beginEdit = (playlist) => {
    setEditingId(getId(playlist));
    setDraft({
      name: playlist.name || "",
      description: playlist.description || "",
      genre: getId(playlist.genre) || playlist.genre || "",
      isPublic: playlist.isPublic !== false,
    });
    setError("");
    setNotice("");
  };

  const cancelEdit = () => {
    setEditingId("");
    setDraft(emptyDraft);
  };

  const deletePlaylist = async (playlist) => {
    const id = getId(playlist);
    if (!window.confirm(`¿Eliminar la playlist «${playlist.name}»?`)) return;
    setBusy(id);
    setError("");
    try {
      await deletePlaylistApi(id);
      dispatch(removePlaylist(id));
      setNotice("Playlist eliminada.");
      onChange?.();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy("");
    }
  };

  const submitCover = async (playlist, event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const image = form.elements.image.files?.[0];
    if (!image) return setError("Seleccioná una imagen de portada.");
    if (!image.type.startsWith("image/")) return setError("El archivo debe ser una imagen.");
    if (image.size > 5 * 1024 * 1024) return setError("La imagen no puede superar 5 MB.");
    const id = getId(playlist);
    setBusy(`cover-${id}`);
    setError("");
    try {
      const updated = await uploadPlaylistCoverApi(id, image);
      if (!hasPlaylist(updated) || !updated.coverImageUrl) {
        throw new Error("La API no confirmó la imagen de portada.");
      }
      dispatch(updatePlaylist({ id, changes: updated }));
      form.reset();
      setNotice("Portada actualizada.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy("");
    }
  };

  const submitTrack = async (playlist, event) => {
    event.preventDefault();
    const id = getId(playlist);
    const track = trackDrafts[id] || { title: "", artist: "" };
    if (!track.title.trim() || !track.artist.trim()) {
      setError("Para agregar una pista se requieren título y artista.");
      return;
    }
    setBusy(`track-${id}`);
    setError("");
    try {
      const updated = await addTrackApi(id, {
        title: track.title.trim(),
        artist: track.artist.trim(),
        album: track.album?.trim() || "",
      });
      if (!hasPlaylist(updated) || !Array.isArray(updated.tracks)) {
        throw new Error("La API no confirmó la pista agregada.");
      }
      dispatch(updatePlaylist({ id, changes: updated }));
      setTrackDrafts((current) => ({ ...current, [id]: { title: "", artist: "", album: "" } }));
      setNotice("Pista agregada.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy("");
    }
  };

  const deleteTrack = async (playlist, track) => {
    const playlistId = getId(playlist);
    if (!window.confirm(`¿Quitar «${track.title}» de la playlist?`)) return;
    setBusy(`track-${playlistId}`);
    setError("");
    try {
      const updated = await removeTrackApi(playlistId, getId(track));
      if (!hasPlaylist(updated) || !Array.isArray(updated.tracks)) {
        throw new Error("La API no confirmó la eliminación de la pista.");
      }
      dispatch(updatePlaylist({ id: playlistId, changes: updated }));
      setNotice("Pista eliminada.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy("");
    }
  };

  const searchTracks = async (playlistId, event) => {
    event.preventDefault();
    const query = trackQueries[playlistId]?.trim();
    if (!query) {
      setError("Escribí un artista o una canción para buscar.");
      return;
    }
    setBusy(`search-${playlistId}`);
    setError("");
    try {
      const results = await searchTracksApi(query);
      if (!Array.isArray(results) || results.some((track) => !track.title || !track.artist)) {
        throw new Error("La API devolvió resultados de búsqueda inválidos.");
      }
      setTrackResults((current) => ({ ...current, [playlistId]: results }));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy("");
    }
  };

  const addSearchResult = async (playlist, track) => {
    const id = getId(playlist);
    setBusy(`track-${id}`);
    setError("");
    try {
      const updated = await addTrackApi(id, track);
      if (!hasPlaylist(updated) || !Array.isArray(updated.tracks)) {
        throw new Error("La API no confirmó la pista agregada.");
      }
      dispatch(updatePlaylist({ id, changes: updated }));
      setTrackResults((current) => ({
        ...current,
        [id]: (current[id] || []).filter((item) => item !== track),
      }));
      setNotice("Pista agregada.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy("");
    }
  };

  const generateVibe = async (playlist) => {
    const id = getId(playlist);
    setBusy(`vibe-${id}`);
    setError("");
    try {
      const result = await generatePlaylistVibeApi(id);
      if (typeof result?.aiVibeSummary !== "string") {
        throw new Error("La API no devolvió el resumen de ambiente.");
      }
      dispatch(updatePlaylist({ id, changes: { aiVibeSummary: result.aiVibeSummary } }));
      setNotice("Resumen generado.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy("");
    }
  };

  return (
    <section className="library-panel" aria-labelledby="library-title">
      <div className="library-heading">
        <div>
          <p className="eyebrow">TU COLECCIÓN</p>
          <h2 id="library-title">Playlists</h2>
        </div>
        <label className="library-filter">
          <span>Filtrar biblioteca</span>
          <input
            type="search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Nombre o género"
          />
        </label>
      </div>

      <form className="playlist-form" onSubmit={savePlaylist}>
        <h3>{editingId ? "Editar playlist" : "Crear playlist"}</h3>
        <div className="playlist-form-grid">
          <label>
            Nombre
            <input maxLength={100} value={draft.name} onChange={(event) => setField("name", event.target.value)} required />
          </label>
          <label>
            Género
            <select value={draft.genre} onChange={(event) => setField("genre", event.target.value)} required>
              <option value="">Seleccionar género</option>
              {genres.map((genre) => <option key={getId(genre)} value={getId(genre)}>{genre.name}</option>)}
            </select>
          </label>
          <label className="playlist-description-field">
            Descripción
            <textarea maxLength={500} rows={2} value={draft.description} onChange={(event) => setField("description", event.target.value)} />
          </label>
          <label className="playlist-public-toggle">
            <input type="checkbox" checked={draft.isPublic} onChange={(event) => setField("isPublic", event.target.checked)} />
            Pública
          </label>
        </div>
        <div className="playlist-form-actions">
          <button className="button button-primary" type="submit" disabled={busy === "save" || !draft.name.trim() || !draft.genre}>
            {busy === "save" ? "Guardando..." : editingId ? "Guardar cambios" : "Crear playlist"}
          </button>
          {editingId && <button className="button button-quiet" type="button" onClick={cancelEdit}>Cancelar</button>}
        </div>
      </form>

      {(error || loadError) && <p className="form-alert dashboard-alert" role="alert">{error || loadError}</p>}
      {notice && <p className="form-success" role="status">{notice}</p>}
      {status === "loading" ? (
        <p className="library-state" role="status">Cargando tu biblioteca...</p>
      ) : visiblePlaylists.length ? (
        <div className="playlist-grid">
          {visiblePlaylists.map((playlist) => {
            const id = getId(playlist);
            const genreName = typeof playlist.genre === "object"
              ? playlist.genre?.name
              : genres.find((genre) => getId(genre) === playlist.genre)?.name;
            const tracks = Array.isArray(playlist.tracks) ? playlist.tracks : [];
            return (
              <article className="playlist-card" key={id}>
                {playlist.coverImageUrl ? (
                  <img className="playlist-cover" src={playlist.coverImageUrl} alt={`Portada de ${playlist.name}`} />
                ) : <div className="playlist-cover playlist-cover-empty" role="img" aria-label="Sin imagen de portada">♫</div>}
                <div className="playlist-card-content">
                  <div className="playlist-card-heading">
                    <div>
                      <p className="eyebrow">{genreName || "Sin género"} · {playlist.isPublic ? "Pública" : "Privada"}</p>
                      <h3>{playlist.name}</h3>
                    </div>
                    <span className="track-count">{tracks.length} pistas</span>
                  </div>
                  {playlist.description && <p className="playlist-description">{playlist.description}</p>}
                  <div className="playlist-actions">
                    <button className="button button-quiet" type="button" onClick={() => beginEdit(playlist)}>Editar</button>
                    <button className="button button-quiet" type="button" disabled={busy === id} onClick={() => deletePlaylist(playlist)}>Eliminar</button>
                  </div>
                  <form className="playlist-cover-form" onSubmit={(event) => submitCover(playlist, event)}>
                    <label>Portada <input name="image" type="file" accept="image/*" /></label>
                    <button className="button button-quiet" type="submit" disabled={busy === `cover-${id}`}>Subir</button>
                  </form>
                  <ul className="track-list">
                    {tracks.map((track) => (
                      <li key={getId(track) || `${track.title}-${track.artist}`}>
                        <span><strong>{track.title}</strong><small>{track.artist}{track.album ? ` · ${track.album}` : ""}</small></span>
                        <button className="icon-button" type="button" aria-label={`Quitar ${track.title}`} title="Quitar pista" onClick={() => deleteTrack(playlist, track)}>×</button>
                      </li>
                    ))}
                  </ul>
                  <form className="track-search-form" onSubmit={(event) => searchTracks(id, event)}>
                    <input
                      aria-label={`Buscar canciones para ${playlist.name}`}
                      placeholder="Buscar artista o canción"
                      value={trackQueries[id] || ""}
                      onChange={(event) => setTrackQueries((current) => ({ ...current, [id]: event.target.value }))}
                    />
                    <button className="button button-quiet" type="submit" disabled={busy === `search-${id}`}>
                      {busy === `search-${id}` ? "Buscando..." : "Buscar en iTunes"}
                    </button>
                  </form>
                  {trackResults[id]?.length > 0 && (
                    <ul className="track-search-results">
                      {trackResults[id].map((track, index) => (
                        <li key={`${track.title}-${track.artist}-${index}`}>
                          <span><strong>{track.title}</strong><small>{track.artist} · {track.album || "Single"}</small></span>
                          <button className="icon-button" type="button" title="Agregar pista" aria-label={`Agregar ${track.title}`} disabled={busy === `track-${id}`} onClick={() => addSearchResult(playlist, track)}>+</button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <form className="track-form" onSubmit={(event) => submitTrack(playlist, event)}>
                    <input aria-label="Título de pista" placeholder="Título" value={trackDrafts[id]?.title || ""} onChange={(event) => setTrackDrafts((current) => ({ ...current, [id]: { ...current[id], title: event.target.value } }))} />
                    <input aria-label="Artista" placeholder="Artista" value={trackDrafts[id]?.artist || ""} onChange={(event) => setTrackDrafts((current) => ({ ...current, [id]: { ...current[id], artist: event.target.value } }))} />
                    <input aria-label="Álbum" placeholder="Álbum (opcional)" value={trackDrafts[id]?.album || ""} onChange={(event) => setTrackDrafts((current) => ({ ...current, [id]: { ...current[id], album: event.target.value } }))} />
                    <button className="button button-primary" type="submit" disabled={busy === `track-${id}`}>Agregar pista</button>
                  </form>
                  <button className="text-button" type="button" disabled={busy === `vibe-${id}`} onClick={() => generateVibe(playlist)}>
                    {busy === `vibe-${id}` ? "Generando..." : "Generar descripción IA"}
                  </button>
                  {playlist.aiVibeSummary && <p className="vibe-summary">{playlist.aiVibeSummary}</p>}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-library">
          <div className="empty-library-icon" aria-hidden="true">♫</div>
          <h3>{filter ? "No hay resultados" : "Tu biblioteca empieza acá"}</h3>
          <p>{filter ? "Probá con otro nombre o género." : "Creá una playlist para organizar la música que te acompaña."}</p>
        </div>
      )}
    </section>
  );
}