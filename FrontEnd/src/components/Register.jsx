import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "./AuthLayout.jsx";
import {
  clearAuthError,
  registerUser,
} from "../redux/features/authSlice.js";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error: apiError } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const isSubmitting = status === "loading";

  const onSubmit = async (values) => {
    const { username, email, password } = values;
    const userData = { username, email, password };
    const result = await dispatch(registerUser(userData));

    if (registerUser.fulfilled.match(result)) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <AuthLayout
      eyebrow="EMPEZÁ A COLECCIONAR"
      title="Creá tu cuenta"
      description="Unos pocos datos y tu biblioteca musical queda pronta."
    >
      <form
        className="auth-form"
        noValidate
        onChange={() => {
          if (apiError) dispatch(clearAuthError());
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        {apiError && (
          <div className="form-alert" role="alert">
            {apiError}
          </div>
        )}

        <div className="field-group">
          <label htmlFor="username">Nombre de usuario</label>
          <input
            id="username"
            autoComplete="username"
            placeholder="Elegí un nombre de usuario"
            aria-invalid={Boolean(errors.username)}
            {...register("username", {
              required: "Ingresá un nombre de usuario.",
              setValueAs: (value) => value.trim(),
            })}
          />
          {errors.username && (
            <span className="field-error">{errors.username.message}</span>
          )}
        </div>

        <div className="field-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vos@email.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email", {
              required: "Ingresá tu email.",
              setValueAs: (value) => value.trim(),
              maxLength: {
                value: 254,
                message: "El email es demasiado largo.",
              },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Ingresá un email válido.",
              },
            })}
          />
          {errors.email && (
            <span className="field-error">{errors.email.message}</span>
          )}
        </div>

        <div className="field-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Ingresá una contraseña"
            aria-invalid={Boolean(errors.password)}
            {...register("password", {
              required: "Ingresá una contraseña.",
              deps: ["confirmPassword"],
            })}
          />
          {errors.password && (
            <span className="field-error">{errors.password.message}</span>
          )}
        </div>

        <div className="field-group">
          <label htmlFor="confirmPassword">Repetir contraseña</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Ingresá la misma contraseña"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register("confirmPassword", {
              required: "Repetí tu contraseña.",
              validate: (value) =>
                value === getValues("password") ||
                "Las contraseñas no coinciden.",
            })}
          />
          {errors.confirmPassword && (
            <span className="field-error">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button
          className="button button-primary auth-submit"
          type="submit"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p className="auth-switch">
        ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
