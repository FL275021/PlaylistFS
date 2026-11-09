const PlusUsageReport = ({ usage, isLoading, onRefresh }) => {
  const isPlus = usage?.plan === "plus";
  const remaining = isPlus ? Math.max(usage.limit - usage.used, 0) : null;

  return (
    <section className="plan-panel" aria-labelledby="usage-title">
      <div className="plan-panel-heading">
        <div>
          <p className="eyebrow">TU PLAN</p>
          <h2 id="usage-title">Uso de tu cuenta</h2>
        </div>
        <button
          className="button button-quiet"
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {usage ? (
        <div className="usage-summary" aria-live="polite">
          <div className="usage-metric">
            <span className="stat-label">Plan actual</span>
            <strong>{isPlus ? "Plus" : "Premium"}</strong>
          </div>
          <div className="usage-metric">
            <span className="stat-label">Playlists creadas</span>
            <strong>{usage.used}</strong>
          </div>
          <div className="usage-metric">
            <span className="stat-label">
              {isPlus ? "Disponibles" : "Límite"}
            </span>
            <strong>{isPlus ? remaining : "Sin límite"}</strong>
          </div>
        </div>
      ) : (
        <p className="plan-empty" aria-live="polite">
          {isLoading
            ? "Consultando el uso de tu plan..."
            : "No se pudo cargar el uso de tu plan."}
        </p>
      )}
    </section>
  );
};

export default PlusUsageReport;
