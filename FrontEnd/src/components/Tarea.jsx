import React from "react";
import { useDispatch } from "react-redux";
import {
  borrarCancionSlice,
  changeCheckedSlice,
} from "../redux/features/cancionsSlice.js";

const Cancion = (propiedades) => {
  const dispatch = useDispatch();

  const { cancion } = propiedades;

  const { userId, id, title, completed } = cancion;

  const onChangeHandler = (evento) => {
    const checked = evento.target.checked;

    console.log(`Cancion ${id} - ${title} - ${checked}`);

    const payload = {
      id: id,
      checked: checked,
    };
    dispatch(changeCheckedSlice(payload));
  };

  const borrarHandler = () => {
    console.log(`Borrar cancion ${id} - ${title}`);
    dispatch(borrarCancionSlice(id));
  };

  return (
    <div className="tarjeta">
      <input
        type="checkbox"
        id={`list_${id}`}
        className="checkbox"
        checked={completed}
        onChange={onChangeHandler}
      />
      <label className="checkLabel" htmlFor={`list_${id}`}>
        {title}
      </label>

      <button onClick={borrarHandler}>Eliminar</button>
    </div>
  );
};

export default Cancion;
