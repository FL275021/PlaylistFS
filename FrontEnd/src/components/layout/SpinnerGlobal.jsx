import { useSelector } from "react-redux";
import Spinner from "react-bootstrap/Spinner";

const hayPeticionesPendientes = (state) =>
  state.loadingSlice.contadorPeticiones > 0;

const SpinnerGlobal = () => {
  const cargando = useSelector(hayPeticionesPendientes);

  if (!cargando) return null;

  return (
    <div className="spinner-global">
      <Spinner animation="border" variant="primary" />
      <span>Cargando...</span>
    </div>
  );
};

export default SpinnerGlobal;
