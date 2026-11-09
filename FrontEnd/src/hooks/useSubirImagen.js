import { useEffect, useId, useState } from "react";
import { uploadImage, deleteImage } from "../services/imageService.js";

const leerComoBase64 = (archivo) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.readAsDataURL(archivo);
  });

/** Selección, vista previa, subida y borrado de una imagen en Cloudinary. */
export const useSubirImagen = ({ handleImgURL, handleImgPublicId, resetKey }) => {
  const inputId = useId();
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState("");
  const [imagenSubida, setImagenSubida] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cuando el formulario padre se limpia, reseteamos todo.
  useEffect(() => {
    setArchivo(null);
    setPreview("");
    setImagenSubida(null);
    handleImgURL("");
    handleImgPublicId("");
  }, [resetKey]);

  // Liberamos la URL temporal del preview al cambiarla o desmontar.
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const seleccionarArchivo = (evento) => {
    const seleccionado = evento.target.files?.[0];
    if (!seleccionado) return;
    setArchivo(seleccionado);
    setPreview(URL.createObjectURL(seleccionado));
  };

  const quitarSeleccion = () => {
    setArchivo(null);
    setPreview("");
    handleImgURL("");
    handleImgPublicId("");
  };

  const subir = async () => {
    if (!archivo) return;
    setLoading(true);
    try {
      const resultado = await uploadImage(await leerComoBase64(archivo));
      setImagenSubida(resultado);
      handleImgURL(resultado.secure_url);
      handleImgPublicId(resultado.public_id);
    } catch (error) {
      alert(`Error al subir la imagen: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async () => {
    if (!imagenSubida?.public_id) return;
    setLoading(true);
    try {
      await deleteImage(imagenSubida.public_id);
      setImagenSubida(null);
      quitarSeleccion();
    } catch (error) {
      alert(`Error al eliminar la imagen: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    inputId, archivo, preview, imagenSubida, loading,
    seleccionarArchivo, quitarSeleccion, subir, eliminar,
  };
};
