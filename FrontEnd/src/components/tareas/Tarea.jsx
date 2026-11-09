import { useTarea } from "../../hooks/useTarea.js";
import TareaTitulo from "./TareaTitulo.jsx";
import TareaImagen from "./TareaImagen.jsx";

const Tarea = ({ tarea }) => {
  const { id, title, completed, imageUrl } = tarea;
  const t = useTarea(tarea);

  return (
    <div className="tarjeta">
      <p>{t.nombreUsuario}</p>
      <input
        type="checkbox"
        id={`list_${id}`}
        className="checkbox"
        checked={completed}
        onChange={t.cambiarCompletada}
      />

      <TareaTitulo
        id={id}
        title={title}
        editando={t.editando}
        tituloEditando={t.tituloEditando}
        onCambiarTitulo={t.cambiarTituloEditando}
        onEditar={t.empezarEdicion}
        onGuardar={t.guardarTitulo}
      />

      <button onClick={t.borrar}>Eliminar</button>

      <TareaImagen url={imageUrl} title={title} />
    </div>
  );
};

export default Tarea;
