const SelectorArchivo = ({ inputId, bloqueado, onChange }) => (
  <>
    <input
      id={inputId}
      type="file"
      accept="image/*"
      onChange={onChange}
      disabled={bloqueado}
      hidden
    />
    <label
      htmlFor={inputId}
      style={{
        display: "inline-block",
        backgroundColor: bloqueado ? "#999" : "#007bff",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: bloqueado ? "not-allowed" : "pointer",
      }}
    >
      📤 Seleccionar archivo
    </label>
  </>
);

export default SelectorArchivo;
