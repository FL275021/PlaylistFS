import { useState, useEffect } from "react";
import Grafica from "./Grafica.jsx";
import { useSelector } from "react-redux";
import { useObtenerNombreUsuario } from "../utils/utils.js";

const reduceTareas = (acc, tarea) => {
  //preguntamos si la tareas esta completada
  if (tarea.completed) {
    //sacamos de la tarea el userId
    const userId = tarea.userId;
    //la persona ya tenia alguna tarea completada
    //entonces sumamos uno al total
    if (acc[userId]) {
      acc[userId] = acc[userId] + 1;
    } else {
      acc[userId] = 1;
    }
  }
  return acc;
};

const MiGrafica = () => {
  const listaTareas = useSelector((state) => state.tareasSlice); //este state representa la pizza completa
  const listaUsuarios = useSelector((state) => state.usersSlice); //este state representa la pizza completa

  const [datos, setDatos] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);

  useEffect(() => {
    if (listaTareas?.length > 0 && listaUsuarios?.length > 0) {
      const objetoCompletadas = listaTareas.reduce(reduceTareas, {});

      console.log("objetoCompletadas", objetoCompletadas);

      const etiquetasIdUser = Object.keys(objetoCompletadas);
      console.log("etiquetasIdUser", etiquetasIdUser);

      const etiquetasAux = etiquetasIdUser.map((e) => obtenerNombreUsuario(e));
      const datosAux = Object.values(objetoCompletadas);
      setDatos(datosAux);
      setEtiquetas(etiquetasAux);

      console.log("etiquetasAux", etiquetasAux);

      console.log("datosAux", datosAux);
    }
  }, [listaTareas, listaUsuarios]);

  const obtenerNombreUsuario = useObtenerNombreUsuario();

  //recorremos las tareas y por cada usuario vemos si la tarea esta completada o no y vemos de agragar a un objeto

  // key representa el userId y el value representa la cantidad de completadas

  return (
    <>
      <h1>Mi grafica</h1>
      <Grafica
        etiquetas={etiquetas}
        datos={datos}
        nombreGrafica={"Mi grafica de prueba"}
      ></Grafica>
    </>
  );
};

export default MiGrafica;
