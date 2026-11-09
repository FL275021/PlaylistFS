import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useLogin } from "../../hooks/useLogin.js";
import CampoLogin from "./CampoLogin.jsx";

const Login = () => {
  const formik = useLogin();

  return (
    <Card style={{ width: "18rem", justifyContent: "center" }}>
      <Card.Body>
        <Form onSubmit={formik.handleSubmit} noValidate>
          <CampoLogin
            formik={formik}
            name="identificador"
            label="Usuario"
            placeholder="Ingresá tu usuario"
          />
          <CampoLogin
            formik={formik}
            name="password"
            label="Contraseña"
            type="password"
            placeholder="Ingresá tu contraseña"
          />
          <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Login;
