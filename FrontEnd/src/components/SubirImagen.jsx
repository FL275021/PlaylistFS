import { useEffect, useId, useState } from "react";
import { uploadImage, deleteImage } from "../services/imageService.js";

const SubirImagen = ({ handleImgURL, handleImgPublicId, resetKey }) => {
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState("");
  const [imagenSubida, setImagenSubida] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputId = useId();

  useEffect(() => {
    setArchivo(null);
    setPreview("");
    setImagenSubida(null);
    handleImgURL("");
    handleImgPublicId("");
  }, [resetKey]);

  useEffect(() => {
    if (!preview) return;
    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (evento) => {
    const seleccionado = evento.target.files?.[0];
    if (!seleccionado) return;

    setArchivo(seleccionado);
    setPreview(URL.createObjectURL(seleccionado));
  };

  const quitarSeleccion = () => {
    setArchivo(null);
    setPreview("");
    handleImgURL("");
    handleImgPublicId("");
  };

  const handleUpload = async () => {
    if (!archivo) return;

    setLoading(true);

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
        reader.readAsDataURL(archivo);
      });

      const resultado = await uploadImage(base64);

      setImagenSubida(resultado);
      handleImgURL(resultado.secure_url);
      handleImgPublicId(resultado.public_id);
    } catch (error) {
      alert(`Error al subir la imagen: ${error.message}`);
    } finally {
      setLoading(false);//
    }
  };

  const handleDelete = async () => {
    if (!imagenSubida?.public_id) return;

    setLoading(true);

    try {
      await deleteImage(imagenSubida.public_id);
      setImagenSubida(null);
      quitarSeleccion();
    } catch (error) {
      alert(`Error al eliminar la imagen: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", textAlign: "center" }}>
      <h2>Imagen</h2>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading || Boolean(imagenSubida)}
        hidden
      />

      <label
        htmlFor={inputId}
        style={{
          display: "inline-block",
          backgroundColor: loading || imagenSubida ? "#999" : "#007bff",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: loading || imagenSubida ? "not-allowed" : "pointer",
        }}
      >
        📤 Seleccionar archivo
      </label>

      {preview && (
        <div style={{ marginTop: 20 }}>
          <img
            src={preview}
            alt="Vista previa"
            style={{ width: "100%", borderRadius: 10 }}
          />
        </div>
      )}

      {archivo && !imagenSubida && (
        <div style={{ marginTop: 16 }}>
          <button type="button" onClick={handleUpload} disabled={loading}>
            {loading ? "Subiendo..." : "Subir imagen"}
          </button>

          <button
            type="button"
            onClick={quitarSeleccion}
            disabled={loading}
            style={{ marginLeft: 8 }}
          >
            Quitar selección
          </button>
        </div>
      )}

      {imagenSubida && (
        <div style={{ marginTop: 16 }}>
          <p>
            <a href={imagenSubida.secure_url} target="_blank" rel="noreferrer">
              Ver imagen en Cloudinary
            </a>
          </p>

          <p>Public ID: {imagenSubida.public_id}</p>

          <button type="button" onClick={handleDelete} disabled={loading}>
            {loading ? "Eliminando..." : "Eliminar imagen de Cloudinary"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SubirImagen;
