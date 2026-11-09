const ImagenSubida = ({ imagen, loading, onEliminar }) => (
  <div style={{ marginTop: 16 }}>
    <p>
      <a href={imagen.secure_url} target="_blank" rel="noreferrer">
        Ver imagen en Cloudinary
      </a>
    </p>
    <p>Public ID: {imagen.public_id}</p>
    <button type="button" onClick={onEliminar} disabled={loading}>
      {loading ? "Eliminando..." : "Eliminar imagen de Cloudinary"}
    </button>
  </div>
);

export default ImagenSubida;
