import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/** Devuelve true si hay token; si no, redirige a /login. */
export const useRequiereLogin = () => {
  const navigate = useNavigate();
  const [estaLogueado, setEstaLogueado] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      setEstaLogueado(true);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return estaLogueado;
};
