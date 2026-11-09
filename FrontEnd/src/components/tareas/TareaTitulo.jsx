// Muestra el título de la tarea o el input para editarlo.
const TareaTitulo = ({
  id,
  title,
  editando,
  tituloEditando,
  onCambiarTitulo,
  onEditar,
  onGuardar,
}) =>
  editando ? (
    <>
      <input
        type="text"
        className="checkLabel"
        value={tituloEditando}
        onChange={onCambiarTitulo}
      />
      <button onClick={onGuardar}>Guardar</button>
    </>
  ) : (
    <>
      <label className="checkLabel" htmlFor={`list_${id}`}>
        {title}
      </label>
      <button onClick={onEditar}>Editar</button>
    </>
  );

export default TareaTitulo;
