const TareaImagen = ({ url, title }) => {
  if (!url) return null;

  return (
    <div style={{ marginTop: "10px" }}>
      <img
        src={url}
        alt={`Imagen de ${title}`}
        style={{ maxWidth: "200px", borderRadius: "8px" }}
      />
    </div>
  );
};

export default TareaImagen;
