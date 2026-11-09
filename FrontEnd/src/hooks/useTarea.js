import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  borrarTareaSlice,
  cambiarTituloTareaSlice,
  changeCheckedSlice,
} from "../redux/features/tareasSlice.js";
import { borrarTareaApi } from "../services/tareasServices.js";
import { useObtenerNombreUsuario } from "../utils/utils.js";

/** Estado y acciones de una tarjeta de tarea. */
export const useTarea = ({ userId, id, title }) => {
  const dispatch = useDispatch();
  const obtenerNombreUsuario = useObtenerNombreUsuario();

  const [editando, setEditando] = useState(false);
  const [tituloEditando, setTituloEditando] = useState(title);

  const cambiarCompletada = (evento) => {
    dispatch(changeCheckedSlice({ id, checked: evento.target.checked }));
  };

  const empezarEdicion = () => setEditando(true);

  const cambiarTituloEditando = (evento) =>
    setTituloEditando(evento.target.value);

  const guardarTitulo = () => {
    // TODO: llamar a la API antes de modificar el store.
    dispatch(cambiarTituloTareaSlice({ id, title: tituloEditando }));
    setEditando(false);
  };

  const borrar = async () => {
    try {
      await borrarTareaApi(id);
      dispatch(borrarTareaSlice(id));
    } catch (err) {
      console.error("err", err);
    }
  };

  return {
    nombreUsuario: obtenerNombreUsuario(userId),
    editando,
    tituloEditando,
    cambiarCompletada,
    empezarEdicion,
    cambiarTituloEditando,
    guardarTitulo,
    borrar,
  };
};
