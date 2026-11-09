import Form from "react-bootstrap/Form";

// Campo de formulario conectado a formik (valor, errores y feedback).
const CampoLogin = ({ formik, name, label, type = "text", placeholder }) => (
  <Form.Group className="mb-3" controlId={name}>
    <Form.Label>{label}</Form.Label>
    <Form.Control
      type={type}
      name={name}
      value={formik.values[name]}
      placeholder={placeholder}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      isInvalid={formik.touched[name] && Boolean(formik.errors[name])}
    />
    <Form.Control.Feedback type="invalid">
      {formik.errors[name]}
    </Form.Control.Feedback>
  </Form.Group>
);

export default CampoLogin;
