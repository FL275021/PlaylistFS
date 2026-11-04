import ActionButton from "./ActionButton";

export default function UserSession({ api }) {
  const { run, userActive, username } = api;
  return (
    <div className="session-box">
      <h3>Usuario de prueba</h3>
      <p className="help">
        Se registra con credenciales de demostración generadas para esta
        pestaña.
      </p>
      <div className="actions">
        <ActionButton action="register" run={run}>1. Registrar usuario</ActionButton>
        <ActionButton action="login" run={run} variant="secondary">2. Iniciar sesión</ActionButton>
        <ActionButton action="me" run={run} variant="secondary">3. Consultar /auth/me</ActionButton>
        <ActionButton action="logout" run={run} variant="secondary">Cerrar sesión</ActionButton>
      </div>
      <p className={`session-status${userActive ? " active" : ""}`}>
        {userActive
          ? `Sesión activa: ${username}`
          : `Sin sesión · Cuenta de prueba: ${username}`}
      </p>
    </div>
  );
}
