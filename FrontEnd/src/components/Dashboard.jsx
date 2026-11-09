import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/features/authSlice.js";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <Link className="brand-lockup dashboard-brand" to="/dashboard">
          <span className="brand-mark" aria-hidden="true">
            O
          </span>
          <span>OB1 Music</span>
        </Link>
        <div className="dashboard-account">
          <span className="account-name">{user?.username || "Tu cuenta"}</span>
          <button className="button button-quiet" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-intro">
          <p className="eyebrow">TU ESPACIO MUSICAL</p>
          <h1>Hola{user?.username ? `, ${user.username}` : ""}.</h1>
          <p>Este es el punto de partida para tus colecciones.</p>
        </div>

        <div className="dashboard-stats">
          <article className="stat-card">
            <span className="stat-label">Tu plan</span>
            <strong>Plus</strong>
            <span className="stat-note">Plan inicial</span>
          </article>
          <article className="stat-card">
            <span className="stat-label">Colecciones</span>
            <strong>0 <small>/ 4</small></strong>
            <span className="stat-note">Disponibles en tu plan actual</span>
          </article>
          <article className="stat-card stat-card-accent">
            <span className="stat-label">Tu biblioteca</span>
            <strong>Empezá acá</strong>
            <span className="stat-note">En preparación para el próximo hito</span>
          </article>
        </div>

        <section className="library-panel">
          <div className="library-heading">
            <div>
              <p className="eyebrow">COLECCIONES</p>
              <h2>Tu biblioteca</h2>
            </div>
            <button className="button button-primary" disabled>
              + Nueva colección
            </button>
          </div>
          <div className="empty-library">
            <span className="empty-library-icon" aria-hidden="true">
              ♫
            </span>
            <h3>Tu primera colección te espera</h3>
            <p>
              En el próximo hito vas a poder crear playlists, buscar canciones y
              sumar una portada.
            </p>
          </div>
        </section>

        <section className="chart-placeholder" aria-label="Espacio reservado para un gráfico">
          <div>
            <p className="eyebrow">TU ACTIVIDAD</p>
            <h2>Tu música toma forma con cada colección</h2>
          </div>
          <div className="chart-bars" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
