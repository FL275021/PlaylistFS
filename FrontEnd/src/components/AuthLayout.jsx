import { Link } from "react-router-dom";

const AuthLayout = ({ eyebrow, title, description, children }) => (
  <main className="auth-shell">
    <aside className="auth-aside">
      <Link className="brand-lockup" to="/login" aria-label="OB1 Music, inicio">
        <span className="brand-mark" aria-hidden="true">
          O
        </span>
        <span>OB1 Music</span>
      </Link>

      <div className="auth-aside-copy">
        <p className="eyebrow">TU MÚSICA, A TU MANERA</p>
        <h1>Un lugar para cada sonido.</h1>
        <p>
          Crea colecciones, descubre canciones y organiza la música que te
          acompaña.
        </p>
      </div>

      <div className="auth-aside-footer">
        <span className="sound-wave" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
        <span>Tu próxima playlist empieza acá.</span>
      </div>
    </aside>

    <section className="auth-main">
      <div className="auth-card">
        <div className="auth-card-heading">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {children}
      </div>
    </section>
  </main>
);

export default AuthLayout;
