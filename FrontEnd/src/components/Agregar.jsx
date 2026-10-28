import { useState, useRef } from "react";
import { agregarTareaSlice } from "../redux/features/tareasSlice.js";
import { useDispatch } from "react-redux";
import { crearTareaApi } from "../services/tareasServices.js";

const Agregar = () => {
  const dispatch = useDispatch();

  const inputRef = useRef();

  const agregarHandler = async (evento) => {
    const title = inputRef.current.value;
    // agregarTarea(title);

    const tareaNueva = {
      title,
      userId: 1,
    };

    const tareaCreada = await crearTareaApi(tareaNueva);

    //aca llamamos a la api que nos devuelve una tarea completa
    //recien cuando salio todo bien llamamos al dispatch

    dispatch(agregarTareaSlice(tareaCreada));

    inputRef.current.value = "";
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
    </div>
  );
};

export default Agregar;
