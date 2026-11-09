import { useState, useRef } from "react";
import { agregarTareaSlice } from "../redux/features/tareasSlice.js";
import { useDispatch } from "react-redux";
import { crearTareaApi } from "../services/tareasServices.js";
import SubirImagen from "./SubirImagen.jsx";

const Agregar = () => {
  const dispatch = useDispatch();

  const inputRef = useRef();

  const [resetKey, setResetKey] = useState(0);
  const [imagenUrl, setImagenUrl] = useState("");
  const [imagenPublicId, setImagenPublicId] = useState("");

  const limpiarFormulario = () => {
    inputRef.current.value = "";
    setImagenUrl("");
    setImagenPublicId("");
    setResetKey((anterior) => anterior + 1);
  };

  const agregarHandler = async (evento) => {
    const title = inputRef.current.value;
    // agregarTarea(title);

    const tareaNueva = {
      title,
      imageUrl: imagenUrl,
      imagePublicId: imagenPublicId,
    };

    const tareaCreadaAux = await crearTareaApi(tareaNueva);
    if (tareaCreadaAux) {
      const tareaNueva = tareaCreadaAux.tarea;
      //aca llamamos a la api que nos devuelve una tarea completa
      //recien cuando salio todo bien llamamos al dispatch

      dispatch(agregarTareaSlice(tareaNueva));
      limpiarFormulario();
    }
  };

  const titleHandler = (evento) => {
    const tituloAux = evento.target.value;
    setTitle(tituloAux);
  };

  // const deshabilitarAgregar = title === "";

  return (
    <div className="agregar">
      <label htmlFor="txtAgregar">Agregar:</label>
      <input
        type="text"
        name="txtAgregar"
        id="txtAgregar"
        // onChange={titleHandler}
        ref={inputRef}
      />
      <input
        type="button"
        value="Agregar"
        onClick={agregarHandler}
        // disabled={deshabilitarAgregar}
      />

      {/* <p>Titulo:{title}</p> */}

      <SubirImagen
        handleImgURL={setImagenUrl}
        handleImgPublicId={setImagenPublicId}
        resetKey={resetKey}
      />
    </div>
  );
};

export default Agregar;
