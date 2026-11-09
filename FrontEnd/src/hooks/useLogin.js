import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

import { esquemaLogin } from "../schemas/loginSchema.js";
import { loginApi } from "../services/authServices.js";
import { programarVencimiento } from "../utils/sesion.js";
import {
  aumentarContadorPeticiones,
  disminuirContadorPeticiones,
} from "../redux/features/loadingSlice.js";

/** Devuelve la instancia de formik del login con todo el submit resuelto. */
export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useFormik({
    initialValues: { identificador: "homero", password: "miclave" },
    validationSchema: esquemaLogin,
    onSubmit: async (valores) => {
      try {
        dispatch(aumentarContadorPeticiones());

        const { token } = await loginApi(valores);

        // Lanza error si el token no tiene formato JWT válido.
        jwtDecode(token);
        localStorage.setItem("token", token);

        programarVencimiento(token, () => {
          localStorage.removeItem("token");
          toast.info("Tu sesión venció. Iniciá sesión nuevamente.");
          navigate("/login", { replace: true });
        });

        toast.success("Bienvenido");
        navigate("/dashboard");
      } catch (error) {
        console.error("Error en login:", error);
        toast.error("No se pudo iniciar sesión. Revisá tus datos.");
      } finally {
        dispatch(disminuirContadorPeticiones());
      }
    },
  });
};
