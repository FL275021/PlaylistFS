import React, { useState, useEffect, useRef } from "react";
import { useContador } from "../utils/utils.js";

const EjemploCustomHook = () => {
  const [contador, aumentar, disminuir] = useContador(0);

  return (
    <div>
      Contador:{contador}
      <button onClick={() => aumentar(contador)}>Aumentar</button>
      <button onClick={() => disminuir(contador)}>Disminuir</button>
    </div>
  );
};
export default EjemploCustomHook;
