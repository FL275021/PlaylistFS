import ActionButton from "./ActionButton";
import SectionCard from "./SectionCard";

export default function GenresSection({ api }) {
  const { run, genres, genreId, selectGenre } = api;
  return (
    <SectionCard
      title="Géneros"
      description="Lecturas con usuario; alta, edición y baja requieren admin."
      step="04"
    >
      <div className="actions">
        <ActionButton action="genres-list" run={run}>GET /genres</ActionButton>
        <ActionButton action="genre-get" run={run} variant="secondary">GET /genres/:id</ActionButton>
        <ActionButton action="genre-create" run={run}>POST /genres (admin)</ActionButton>
        <ActionButton action="genre-update" run={run} variant="secondary">PATCH /genres/:id (admin)</ActionButton>
        <ActionButton action="genre-delete" run={run} variant="danger">DELETE /genres/:id (admin)</ActionButton>
      </div>
      <div className="field-row separate">
        <div className="field">
          <label htmlFor="genreSelect">Género para pruebas de playlist</label>
          <select
            id="genreSelect"
            value={genreId}
            onChange={(e) => selectGenre(e.target.value)}
          >
            {genres === null && <option value="">Primero consultá los géneros</option>}
            {genres?.length === 0 && <option value="">No hay géneros disponibles</option>}
            {genres?.map((g) => {
              const id = g.id || g._id;
              return <option key={id} value={id}>{g.name}</option>;
            })}
          </select>
        </div>
      </div>
      <p className="footnote">
        El género creado para prueba es nuevo y solo se puede borrar si no
        tiene playlists asociadas.
      </p>
    </SectionCard>
  );
}
