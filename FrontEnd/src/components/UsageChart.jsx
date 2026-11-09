const UsageChart = ({ usage }) => {
  if (!usage) {
    return (
      <section className="usage-chart-panel" aria-labelledby="chart-title">
        <p className="eyebrow">TU ACTIVIDAD</p>
        <h2 id="chart-title">Playlists de tu cuenta</h2>
        <p className="plan-empty">El gráfico estará disponible al cargar el uso.</p>
      </section>
    );
  }

  const isPlus = usage.plan === "plus";
  const remaining = isPlus ? Math.max(usage.limit - usage.used, 0) : 0;
  const values = isPlus
    ? [
        { label: "Usadas", value: usage.used, color: "var(--purple)" },
        { label: "Disponibles", value: remaining, color: "#a9c5ad" },
      ]
    : [{ label: "Creadas", value: usage.used, color: "var(--purple)" }];
  const maximum = Math.max(usage.limit || 0, usage.used, 1);

  return (
    <section className="usage-chart-panel" aria-labelledby="chart-title">
      <div className="plan-panel-heading">
        <div>
          <p className="eyebrow">TU ACTIVIDAD</p>
          <h2 id="chart-title">Playlists de tu cuenta</h2>
        </div>
        <span className="chart-caption">
          {isPlus ? `Límite Plus: ${usage.limit}` : "Plan sin límite"}
        </span>
      </div>
      <div className="usage-chart">
        {values.map(({ label, value, color }) => {
          const barHeight = (value / maximum) * 100;
          return (
            <div className="usage-chart-column" key={label}>
              <span className="usage-chart-value">{value}</span>
              <div className="usage-chart-track">
                <span
                  className="usage-chart-bar"
                  style={{
                    height: `${barHeight}%`,
                    backgroundColor: color,
                  }}
                  role="img"
                  aria-label={`${label}: ${value} playlists`}
                />
              </div>
              <span className="usage-chart-label">{label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default UsageChart;
