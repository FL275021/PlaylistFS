import App from "../../App.jsx";
import { useRequiereLogin } from "../../hooks/useRequiereLogin.js";

const Dashboard = () => {
  const estaLogueado = useRequiereLogin();

  if (!estaLogueado) return <p>Cargando</p>;

  return (
    <div>
      <App />
    </div>
  );
};

export default Dashboard;
