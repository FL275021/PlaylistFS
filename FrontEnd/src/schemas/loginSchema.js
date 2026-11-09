import * as Yup from "yup";

export const esquemaLogin = Yup.object({
  identificador: Yup.string()
    .required("El usuario es obligatorio")
    .min(3, "El usuario debe tener al menos 3 caracteres"),
  password: Yup.string()
    .required("La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});
