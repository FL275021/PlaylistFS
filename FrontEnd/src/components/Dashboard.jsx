import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/features/authSlice.js";
import { usePlanUsage } from "../hooks/usePlanUsage.js";
import PlanUpgrade from "./PlanUpgrade.jsx";
import PlusUsageReport from "./PlusUsageReport.jsx";
import UsageChart from "./UsageChart.jsx";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const {
    usage,
    isLoading,
    isUpgrading,
    error,
    refresh,
    upgrade,
  } = usePlanUsage();

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
          <button
            className="button button-quiet"
            type="button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-intro">
          <p className="eyebrow">TU ESPACIO MUSICAL</p>
          <h1>Hola{user?.username ? `, ${user.username}` : ""}.</h1>
          <p>Consultá el uso de tu plan y administrá tu cuenta.</p>
        </div>

        <div className="dashboard-stats">
          <article className="stat-card">
            <span className="stat-label">Tu plan</span>
            <strong>
              {usage?.plan === "premium"
                ? "Premium"
                : usage?.plan === "plus"
                  ? "Plus"
                  : "—"}
            </strong>
            <span className="stat-note">
              {isLoading ? "Consultando tu plan" : "Plan actual"}
            </span>
          </article>
          <article className="stat-card">
            <span className="stat-label">Playlists creadas</span>
            <strong>{usage?.used ?? "—"}</strong>
            <span className="stat-note">Recursos de tu cuenta</span>
          </article>
          <article className="stat-card stat-card-accent">
            <span className="stat-label">Disponibles en Plus</span>
            <strong>
              {usage?.plan === "plus"
                ? Math.max(usage.limit - usage.used, 0)
                : usage?.plan === "premium"
                  ? "∞"
                  : "—"}
            </strong>
            <span className="stat-note">
              {usage?.plan === "premium"
                ? "Tu plan no tiene límite"
                : "Según el uso actual"}
            </span>
          </article>
        </div>

        <PlusUsageReport
          usage={usage}
          isLoading={isLoading}
          onRefresh={() => refresh()}
        />
        {error && (
          <p className="form-alert dashboard-alert" role="alert">
            {error}
          </p>
        )}
        <PlanUpgrade
          plan={usage?.plan || user?.plan}
          isUpgrading={isUpgrading}
          onUpgrade={upgrade}
        />
        <UsageChart usage={usage} />
      </section>
    </main>
  );
};

export default Dashboard;
