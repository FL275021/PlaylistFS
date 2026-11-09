import { useSelector } from "react-redux";
import { filtrarTareasPorSearch } from "../../redux/features/tareasSlice.js";
import FiltroTareas from "./FiltroTareas.jsx";
import Tarea from "./Tarea.jsx";

const Tareas = () => {
  const tareasFiltradas = useSelector(filtrarTareasPorSearch);

  return (
    <>
      <FiltroTareas />
      <div className="tarjetas">
        {tareasFiltradas?.map((tarea) => (
          <Tarea key={tarea.id} tarea={tarea} />
        ))}
      </div>
    </>
  );
};

export default Tareas;
