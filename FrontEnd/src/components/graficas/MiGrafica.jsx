import { useGraficaCompletadas } from "../../hooks/useGraficaCompletadas.js";
import Grafica from "./Grafica.jsx";

const MiGrafica = () => {
  const { etiquetas, datos } = useGraficaCompletadas();

  return (
    <>
      <h1>Mi grafica</h1>
      <Grafica
        etiquetas={etiquetas}
        datos={datos}
        nombreGrafica="Mi grafica de prueba"
      />
    </>
  );
};

export default MiGrafica;
