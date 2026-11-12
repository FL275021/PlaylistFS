import { useSelector } from "react-redux";

const UsageChart = () => {
  const playlists = useSelector((state) => state.playlists.items);
  const genres = useSelector((state) => state.genres);
  const counts = genres.map((genre) => ({
    label: genre.name,
    value: playlists.filter((playlist) =>
      (typeof playlist.genre === "object" ? playlist.genre?.id || playlist.genre?._id : playlist.genre) === (genre.id || genre._id),
    ).length,
  }));
  const values = counts.length ? counts : [{ label: "Sin género", value: playlists.length }];
  const maximum = Math.max(...values.map((item) => item.value), 1);

  return (
    <section className="usage-chart-panel" aria-labelledby="chart-title">
      <div className="plan-panel-heading">
        <div>
          <p className="eyebrow">TU ACTIVIDAD</p>
          <h2 id="chart-title">Playlists por género</h2>
        </div>
        <span className="chart-caption">
          {playlists.length} en total
        </span>
      </div>
      <div className="usage-chart">
        {values.map(({ label, value }) => {
          const barHeight = (value / maximum) * 100;
          return (
            <div className="usage-chart-column" key={label}>
              <span className="usage-chart-value">{value}</span>
              <div className="usage-chart-track">
                <span
                  className="usage-chart-bar"
                  style={{ height: `${barHeight}%` }}
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
