import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "./AuthLayout.jsx"; 
import {
  clearAuthError,
  loginUser,
} from "../redux/features/authSlice.js";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error: apiError } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const isSubmitting = status === "loading";

  const onSubmit = async (values) => {
    const result = await dispatch(loginUser(values));

    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard", { replace: true });
    }
  };


  return (
    <AuthLayout
      eyebrow="Alo alo"
      title="Inicia sesion"
      description="Accede a tus colecciones y seguí escuchando."
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
          <label htmlFor="identifier">Usuario o email</label>
          <input
            id="identifier"
            autoComplete="username"
            placeholder="Ej. rafael o vos@email.com"
            aria-invalid={Boolean(errors.identifier)}
            {...register("identifier", {
              required: "Ingresa tu usuario o email.",
              setValueAs: (value) => value.trim(),
            })}
          />
          {errors.identifier && (
            <span className="field-error">{errors.identifier.message}</span>
          )}
        </div>

        <div className="field-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Ingresa tu contraseña"
            aria-invalid={Boolean(errors.password)}
            {...register("password", {
              required: "Ingresa tu contraseña.",
            })}
          />
          {errors.password && (
            <span className="field-error">{errors.password.message}</span>
          )}
        </div>

        <button
          className="button button-primary auth-submit"
          type="submit"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p className="auth-switch">
        ¿Todavía no tenes cuenta? <Link to="/register">Crear cuenta</Link>
      </p>
    </AuthLayout>
  );
};



export default Login;
