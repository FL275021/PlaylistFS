import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { obtenerTareasApi } from "../services/tareasServices.js";
import { obtenerUsuariosApi } from "../services/usersServices.js";
import { cargarTareasInicialesSlice } from "../redux/features/tareasSlice.js";
import { cargaInicialUsersSlice } from "../redux/features/usersSlice.js";
import {
  aumentarContadorPeticiones,
  disminuirContadorPeticiones,
} from "../redux/features/loadingSlice.js";

/**
 * Carga tareas y usuarios al montar, mostrando el spinner global y
 * cancelando las peticiones si el componente se desmonta.
 */
export const useCargaInicial = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const controller = new AbortController();

    const cargar = async (obtener, guardar) => {
      dispatch(aumentarContadorPeticiones());
      try {
        const datos = await obtener(controller.signal);
        dispatch(guardar(datos));
      } catch (error) {
        if (error.code === "ERR_CANCELED") {
          console.log("Petición cancelada");
        }
      } finally {
        dispatch(disminuirContadorPeticiones());
      }
    };

    cargar(obtenerTareasApi, cargarTareasInicialesSlice);
    cargar(obtenerUsuariosApi, cargaInicialUsersSlice);

    return () => controller.abort();
  }, [dispatch]);
};
