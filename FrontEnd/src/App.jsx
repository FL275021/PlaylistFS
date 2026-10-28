import "./App.css";
import Dashboard from "./components/Dashboard.jsx";
import Login from "./components/Login.jsx";
import { useState, useEffect } from "react";

import "./styles/estilos.css";

const App = () => {
  const [logueado, setLogueado] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const estaLogueado = token ? true : false;

    setLogueado(estaLogueado);
  });

  return <>{logueado ? <Dashboard></Dashboard> : <Login></Login>}</>;
};

export default App;
