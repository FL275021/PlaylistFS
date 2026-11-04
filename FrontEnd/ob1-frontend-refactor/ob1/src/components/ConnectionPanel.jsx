import ActionButton from "./ActionButton";
import UserSession from "./UserSession";
import AdminSession from "./AdminSession";

export default function ConnectionPanel({ api }) {
  const { run, apiBase, setApiBase, resetOutput } = api;
  return (
    <section className="panel" aria-labelledby="config-title">
      <h2 id="config-title">Conexión y sesiones</h2>
      <p className="help">
        Iniciá la API en el puerto 4000 y serví esta página con Vite desde
        FrontEnd. No abras el HTML como <code>file://</code>, porque el
        navegador puede bloquear las solicitudes por CORS.
      </p>
      <div className="api-row">
        <div className="field">
          <label htmlFor="apiBase">URL base de la API</label>
          <input
            id="apiBase"
            value={apiBase}
            onChange={(e) => setApiBase(e.target.value)}
          />
        </div>
        <ActionButton action="health" run={run}>Probar conexión</ActionButton>
        <button type="button" className="secondary" onClick={resetOutput}>
          Limpiar resultados
        </button>
      </div>

      <div className="session-row">
        <UserSession api={api} />
        <AdminSession api={api} />
      </div>
      <p className="footnote">
        La página guarda solo los identificadores de prueba en{" "}
        <code>sessionStorage</code>; los tokens permanecen en memoria y se
        borran al recargar o cerrar sesión.
      </p>
    </section>
  );
}
