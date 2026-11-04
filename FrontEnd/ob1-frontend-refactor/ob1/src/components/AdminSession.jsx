import ActionButton from "./ActionButton";

export default function AdminSession({ api }) {
  const {
    run, adminActive,
    adminIdentifier, setAdminIdentifier,
    adminPassword, setAdminPassword,
  } = api;
  return (
    <div className="session-box">
      <h3>Sesión de administrador</h3>
      <p className="help">
        Usá credenciales admin configuradas en el seed del backend. No se
        guardan en la página.
      </p>
      <div className="inline-fields">
        <div className="field">
          <label htmlFor="adminIdentifier">Usuario o email admin</label>
          <input
            id="adminIdentifier"
            autoComplete="username"
            value={adminIdentifier}
            onChange={(e) => setAdminIdentifier(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="adminPassword">Contraseña admin</label>
          <input
            id="adminPassword"
            type="password"
            autoComplete="current-password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="actions">
        <ActionButton action="admin-login" run={run}>Login admin</ActionButton>
        <ActionButton action="admin-logout" run={run} variant="secondary">Cerrar sesión admin</ActionButton>
      </div>
      <p className={`session-status${adminActive ? " active" : ""}`}>
        {adminActive ? "Sesión admin activa" : "Sin sesión admin"}
      </p>
    </div>
  );
}
