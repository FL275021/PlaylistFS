import ActionButton from "./ActionButton";
import SectionCard from "./SectionCard";

export default function TracksSection({ api }) {
  const { run, trackQuery, setTrackQuery, setCoverFile } = api;
  return (
    <SectionCard
      title="Pistas, imagen e IA"
      description="La búsqueda consulta iTunes; la imagen usa multipart/form-data."
      step="06"
    >
      <div className="field-row">
        <div className="field">
          <label htmlFor="trackQuery">Buscar en iTunes</label>
          <input
            id="trackQuery"
            value={trackQuery}
            onChange={(e) => setTrackQuery(e.target.value)}
          />
        </div>
        <ActionButton action="track-search" run={run}>GET /tracks/search</ActionButton>
      </div>
      <div className="actions">
        <ActionButton action="track-add" run={run}>POST /playlists/:id/tracks</ActionButton>
        <ActionButton action="track-remove" run={run} variant="secondary">DELETE /playlists/:id/tracks/:trackId</ActionButton>
        <ActionButton action="vibe" run={run} variant="secondary">POST generate-vibe</ActionButton>
      </div>
      <div className="field-row separate">
        <div className="field">
          <label htmlFor="coverImage">Imagen de portada (máximo 5 MB)</label>
          <input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0] || null)}
          />
        </div>
        <ActionButton action="cover-upload" run={run}>Subir portada</ActionButton>
      </div>
      <p className="footnote">
        Para la subida real de imagen se necesita tener Cloudinary
        configurado en el backend.
      </p>
    </SectionCard>
  );
}
