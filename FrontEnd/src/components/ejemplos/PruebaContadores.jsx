import { useState, useEffect } from "react";

let miVariableExterna = 0;

const PruebaContadores = () => {
  const [contador1, setContador1] = useState(0);
  const [contador2, setContador2] = useState(0);

  useEffect(() => {
    console.log("Ejecuto useEffect");
  }, [contador1]);

  miVariableExterna++;
  console.log("miVariableExterna", miVariableExterna);

  return (
    <>
      <div>
        Contador1: {contador1}
        <button onClick={() => setContador1(contador1 + 1)}>Aumentar</button>
      </div>
      <div>
        Contador2: {contador2}
        <button onClick={() => setContador2(contador2 + 1)}>Aumentar</button>
      </div>
    </>
  );
};

export default PruebaContadores;
