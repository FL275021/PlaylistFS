import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { agregarTareaSlice } from "../redux/features/tareasSlice.js";
import { crearTareaApi } from "../services/tareasServices.js";

export const useAgregarTarea = () => {
  const dispatch = useDispatch();
  const inputRef = useRef();

  const [resetKey, setResetKey] = useState(0);
  const [imagenUrl, setImagenUrl] = useState("");
  const [imagenPublicId, setImagenPublicId] = useState("");

  const limpiarFormulario = () => {
    inputRef.current.value = "";
    setImagenUrl("");
    setImagenPublicId("");
    setResetKey((anterior) => anterior + 1);
  };

  const agregar = async () => {
    const respuesta = await crearTareaApi({
      title: inputRef.current.value,
      imageUrl: imagenUrl,
      imagePublicId: imagenPublicId,
    });

    // Solo actualizamos el store cuando la API respondió bien.
    if (respuesta) {
      dispatch(agregarTareaSlice(respuesta.tarea));
      limpiarFormulario();
    }
  };

  return { inputRef, resetKey, setImagenUrl, setImagenPublicId, agregar };
};
