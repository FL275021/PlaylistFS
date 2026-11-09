import React, { useId, useState, useEffect } from "react";
import Tarea from "./Tarea.jsx";
import { useSelector } from "react-redux";

const Tareas = () => {
  const listaTareas = useSelector((state) => state.tareasSlice); //este state representa la pizza completa

  const [listaTareasFiltradas, setListaTareasFiltradas] = useState([]);

  useEffect(() => {
    setListaTareasFiltradas(listaTareas);
  }, [listaTareas]);

  const idInputFiltro = useId();

  const handlerFilter = (e) => {
    const textoAFiltrar = e.target.value;
    console.log("textoAFiltrar", textoAFiltrar);

    if (textoAFiltrar.trim() == "") {
      setListaTareasFiltradas([]);
    } else {
      const auxListaFiltrada = listaTareas?.filter((t) =>
        t.title.includes(textoAFiltrar),
      );
      console.log("auxListaFiltrada", auxListaFiltrada);
      setListaTareasFiltradas(auxListaFiltrada);
    }
  };

  return (
    <>
      <label htmlFor={idInputFiltro}></label>
      <input type="text" onChange={handlerFilter} id={idInputFiltro}></input>

      <div className="tarjetas">
        {listaTareasFiltradas?.map((tarea) => (
          <Tarea key={tarea.id} tarea={tarea} />
        ))}
      </div>
    </>
  );
};

export default Tareas;
