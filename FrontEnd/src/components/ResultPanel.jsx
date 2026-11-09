export default function ResultPanel({ api }) {
  const { output, lastRequest, history } = api;
  const count = history.length;
  return (
    <section className="result-panel" aria-labelledby="results-title">
      <div className="result-header">
        <h2 id="results-title">Última respuesta</h2>
        <span>{lastRequest}</span>
      </div>
      <pre id="results" aria-live="polite">{output}</pre>
      <div className="result-header">
        <h2>Historial de solicitudes</h2>
        <span>{count} solicitud{count === 1 ? "" : "es"}</span>
      </div>
      <div id="history" aria-live="polite">
        {history.map((item) => (
          <div className="history-item" key={item.id}>
            <span className={item.ok ? "ok" : "fail"}>{item.ok ? "OK" : "ERROR"}</span>
            <span>{String(item.status)}</span>
            <span>{item.method} {item.path}</span>
            <span>{item.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
