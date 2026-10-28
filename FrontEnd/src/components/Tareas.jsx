import React from "react";
import Cancion from "./Cancion.jsx";
import { useSelector } from "react-redux";

const Canciones = () => {
  const listaCanciones = useSelector((state) => state.cancionesSlice); //este state representa la pizza completa

  return (
    <div className="tarjetas">
      {listaCanciones?.map((cancion) => (
        <Cancion key={cancion.id} cancion={cancion} />
      ))}
    </div>
  );
};

export default Canciones;
