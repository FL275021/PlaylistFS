import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Agregar from "./Agregar.jsx";
import Canciones from "./Canciones.jsx";
import { obtenerCancionesApi } from "../services/cancionesServices.js";
import { cargarCancionesInicialesSlice } from "../redux/features/cancionesSlice.js";

const Playlist = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const controller = new AbortController();

    const obtenerCanciones = async () => {
      try {
        const listaCanciones = await obtenerCancionesApi(controller.signal);
        dispatch(cargarCancionesInicialesSlice(listaCanciones));
      } catch (error) {
        if (error.code === "ERR_CANCELED") {
          console.log("Petición cancelada");
          return;
        }
        console.error(error);
        // setError("No se pudieron cargar los usuarios");
      }
    };

    //llamamos al servicio de canciones
    obtenerCanciones();
    //limpiar la llamada a la api cuando se destruya el componente
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="Playlist">
      <Agregar />
      <Canciones />
    </div>
  );
};

export default Playlist;
