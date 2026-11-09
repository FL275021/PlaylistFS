import { useState } from "react";

export default function FormGeneral() {
  const [valores, setValores] = useState({ nombre: "", tik: false });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setValores({ ...valores, [name]: type === "checkbox" ? checked : value });
  };

  return (
    <div>
      <input
        type="text"
        name="nombre"
        value={valores.nombre}
        placeholder="Ingrese nombre"
        onChange={handleChange}
      />
      <input
        type="checkbox"
        name="tik"
        checked={valores.tik}
        onChange={handleChange}
      />
    </div>
  );
}
