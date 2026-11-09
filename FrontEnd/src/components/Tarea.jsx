import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  borrarTareaSlice,
  cambiarTituloTareaSlice,
  changeCheckedSlice,
} from "../redux/features/tareasSlice.js";
import { useObtenerNombreUsuario } from "../utils/utils.js";
import { borrarTareaApi } from "../services/tareasServices.js";

const Tarea = (propiedades) => {
  const { tarea } = propiedades;
  const { userId, id, title, completed, imageUrl } = tarea;
  const [editando, setEditando] = useState(false);
  const [tituloEditando, setTituloEditando] = useState(title);

  const obtenerNombreUsuario = useObtenerNombreUsuario();

  const dispatch = useDispatch();

  const onChangeHandler = (evento) => {
    const checked = evento.target.checked;

    console.log(`Tarea ${id} - ${title} - ${checked}`);

    const payload = {
      id: id,
      checked: checked,
    };
    dispatch(changeCheckedSlice(payload));
  };

  const handlerEditar = (e) => {
    setEditando(true);
  };

  const handlerGuardar = (e) => {
    //aca se deberia llamar a la api
    //llamar al store para modificar el title
    const payload = {
      id,
      title: tituloEditando,
    };
    dispatch(cambiarTituloTareaSlice(payload));
    setEditando(false);
  };

  const borrarHandler = async () => {
    try {
      console.log(`Borrar tarea ${id} - ${title}`);
      await borrarTareaApi(id);
      dispatch(borrarTareaSlice(id));
    } catch (err) {
      console.error("err", err);
    }
  };

  const handlerTextoEditando = (e) => {
    const tituloAux = e.target.value;
    setTituloEditando(tituloAux);
  };

  return (
    <div className="tarjeta">
      <p>{obtenerNombreUsuario(userId)}</p>
      <input
        type="checkbox"
        id={`list_${id}`}
        className="checkbox"
        checked={completed}
        onChange={onChangeHandler}
      />
      {/* <label className="checkLabel" htmlFor={`list_${id}`}>
        {title}
      </label> */}

      {editando ? (
        <>
          <input
            type="text"
            className="checkLabel"
            checked={completed}
            onChange={handlerTextoEditando}
            value={tituloEditando}
          />
          <button onClick={handlerGuardar}>Guardar</button>
        </>
      ) : (
        <>
          <label className="checkLabel" htmlFor={`list_${id}`}>
            {title}
          </label>
          <button onClick={handlerEditar}>Editar</button>
        </>
      )}

      <button onClick={borrarHandler}>Eliminar</button>

      {imageUrl && (
        <div style={{ marginTop: "10px" }}>
          <img
            src={imageUrl}
            alt={`Imagen de ${title}`}
            style={{ maxWidth: "200px", borderRadius: "8px" }}
          />
        </div>
      )}
    </div>
  );
};

export default Tarea;
