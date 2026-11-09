import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { filtrarTareasPorSearch } from "../redux/features/tareasSlice.js";
import { useObtenerNombreUsuario } from "../utils/utils.js";

// Cuenta cuántas tareas completadas tiene cada userId.
const contarCompletadasPorUsuario = (acc, tarea) => {
  if (tarea.completed) {
    acc[tarea.userId] = (acc[tarea.userId] || 0) + 1;
  }
  return acc;
};

/** Devuelve { etiquetas, datos } con las tareas completadas por usuario. */
export const useGraficaCompletadas = () => {
  const tareasFiltradas = useSelector(filtrarTareasPorSearch);
  const usuarios = useSelector((state) => state.usersSlice);
  const obtenerNombreUsuario = useObtenerNombreUsuario();

  const [datos, setDatos] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);

  useEffect(() => {
    if (tareasFiltradas?.length > 0 && usuarios?.length > 0) {
      const completadas = tareasFiltradas.reduce(contarCompletadasPorUsuario, {});

      setEtiquetas(Object.keys(completadas).map((id) => obtenerNombreUsuario(id)));
      setDatos(Object.values(completadas));
    }
  }, [tareasFiltradas, usuarios]);

  return { etiquetas, datos };
};
