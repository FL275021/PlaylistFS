import { useSubirImagen } from "../../hooks/useSubirImagen.js";
import SelectorArchivo from "./SelectorArchivo.jsx";
import ImagenSubida from "./ImagenSubida.jsx";

const SubirImagen = (props) => {
  const img = useSubirImagen(props);

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", textAlign: "center" }}>
      <h2>Imagen</h2>

      <SelectorArchivo
        inputId={img.inputId}
        bloqueado={img.loading || Boolean(img.imagenSubida)}
        onChange={img.seleccionarArchivo}
      />

      {img.preview && (
        <div style={{ marginTop: 20 }}>
          <img
            src={img.preview}
            alt="Vista previa"
            style={{ width: "100%", borderRadius: 10 }}
          />
        </div>
      )}

      {img.archivo && !img.imagenSubida && (
        <div style={{ marginTop: 16 }}>
          <button type="button" onClick={img.subir} disabled={img.loading}>
            {img.loading ? "Subiendo..." : "Subir imagen"}
          </button>
          <button
            type="button"
            onClick={img.quitarSeleccion}
            disabled={img.loading}
            style={{ marginLeft: 8 }}
          >
            Quitar selección
          </button>
        </div>
      )}

      {img.imagenSubida && (
        <ImagenSubida
          imagen={img.imagenSubida}
          loading={img.loading}
          onEliminar={img.eliminar}
        />
      )}
    </div>
  );
};

export default SubirImagen;
