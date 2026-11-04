import ActionButton from "./ActionButton";
import SectionCard from "./SectionCard";

export default function PlaylistsSection({ api }) {
  const { run } = api;
  return (
    <SectionCard
      title="Playlists"
      description="Operaciones autenticadas sobre la playlist de demostración."
      step="05"
    >
      <div className="actions">
        <ActionButton action="playlist-create" run={run}>POST /playlists</ActionButton>
        <ActionButton action="playlists-list" run={run} variant="secondary">GET /playlists</ActionButton>
        <ActionButton action="playlists-filter" run={run} variant="secondary">Filtrar por género y texto</ActionButton>
        <ActionButton action="playlist-get" run={run} variant="secondary">GET /playlists/:id</ActionButton>
        <ActionButton action="playlist-update" run={run} variant="secondary">PATCH /playlists/:id</ActionButton>
        <ActionButton action="playlist-delete" run={run} variant="danger">DELETE /playlists/:id</ActionButton>
        <ActionButton action="playlist-cleanup" run={run} variant="secondary">Limpiar playlists de prueba</ActionButton>
      </div>
      <div className="separate">
        <p className="help">
          El límite de Plus es 4. Este flujo crea playlists solo para la
          cuenta temporal de prueba y también comprueba el rechazo de la
          quinta antes de subir a Premium.
        </p>
        <div className="actions">
          <ActionButton action="plan-limit" run={run}>Probar límite Plus (crea datos)</ActionButton>
          <ActionButton action="usage" run={run} variant="secondary">GET /users/me/usage</ActionButton>
          <ActionButton action="upgrade" run={run} variant="secondary">PATCH upgrade-plan</ActionButton>
        </div>
      </div>
    </SectionCard>
  );
}
