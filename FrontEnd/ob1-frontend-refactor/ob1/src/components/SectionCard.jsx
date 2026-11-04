// Contenedor común de cada bloque de pruebas (título, descripción y número).
export default function SectionCard({ title, description, step, children }) {
  return (
    <section className="section-card">
      <div className="section-heading">
        <div>
          <h2 className="section-title">{title}</h2>
          <p>{description}</p>
        </div>
        <span className="step">{step}</span>
      </div>
      {children}
    </section>
  );
}
