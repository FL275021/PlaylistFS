import React, { useState } from "react";
export default function FormGeneral() {
  const [valores, setValores] = useState({ nombre: "", tik: false });

  const handleChange = (e) => {
    const auxValores = { ...valores };
    const name = e.target.name;
    const type = e.target.type;
    //aca hay que saber el type
    const value = type == "checkbox" ? e.target.checked : e.target.value;
    auxValores[name] = value;
    console.log("auxValores", auxValores);
    setValores(auxValores);
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
