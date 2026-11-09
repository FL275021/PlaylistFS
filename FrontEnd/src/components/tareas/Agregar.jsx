import { useAgregarTarea } from "../../hooks/useAgregarTarea.js";
import SubirImagen from "../imagen/SubirImagen.jsx";

const Agregar = () => {
  const { inputRef, resetKey, setImagenUrl, setImagenPublicId, agregar } =
    useAgregarTarea();

  return (
    <div className="agregar">
      <label htmlFor="txtAgregar">Agregar:</label>
      <input type="text" name="txtAgregar" id="txtAgregar" ref={inputRef} />
      <input type="button" value="Agregar" onClick={agregar} />

      <SubirImagen
        handleImgURL={setImagenUrl}
        handleImgPublicId={setImagenPublicId}
        resetKey={resetKey}
      />
    </div>
  );
};

export default Agregar;
