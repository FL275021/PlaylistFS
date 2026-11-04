import ActionButton from "./ActionButton";
import SectionCard from "./SectionCard";

export default function UsersSection({ api }) {
  const { run, adminUserId, setAdminUserId } = api;
  return (
    <SectionCard
      title="Mi usuario y administración"
      description="Perfil propio requiere usuario; las rutas administrativas requieren admin."
      step="07"
    >
      <div className="actions">
        <ActionButton action="profile-update" run={run}>PATCH /users/me</ActionButton>
        <ActionButton action="admin-users" run={run} variant="secondary">GET /users (admin)</ActionButton>
      </div>
      <div className="field-row separate">
        <div className="field">
          <label htmlFor="adminUserId">ID de usuario (rutas admin)</label>
          <input
            id="adminUserId"
            placeholder="24 caracteres hexadecimales"
            value={adminUserId}
            onChange={(e) => setAdminUserId(e.target.value)}
          />
        </div>
        <ActionButton action="admin-user-get" run={run} variant="secondary">GET /users/:id</ActionButton>
        <ActionButton action="admin-user-delete" run={run} variant="danger">DELETE /users/:id</ActionButton>
      </div>
      <div className="actions separate">
        <ActionButton action="delete-me" run={run} variant="danger">DELETE /users/me (irreversible)</ActionButton>
      </div>
      <p className="footnote">
        Borrar la cuenta elimina también sus playlists. Las acciones de
        borrado piden confirmación.
      </p>
    </SectionCard>
  );
}
