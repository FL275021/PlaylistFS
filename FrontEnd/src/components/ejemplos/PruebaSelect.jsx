import { useState } from "react";

const listaOpciones = [
  { value: "bart", texto: "Bart" },
  { value: "lisa", texto: "Lisa" },
  { value: "homero", texto: "Homero" },
  { value: "marge", texto: "Marge" },
];

export default function PruebaSelect() {
  const [seleccion, setSeleccion] = useState("");

  return (
    <div>
      <select
        value={seleccion}
        name="seleccion"
        onChange={(e) => setSeleccion(e.target.value)}
      >
        {listaOpciones.map((o) => (
          <option key={o.value} value={o.value}>
            {o.texto}
          </option>
        ))}
      </select>
    </div>
  );
}
