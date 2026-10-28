import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

import React, { useState } from "react";
import { loginApi } from "../services/authServices.js";

const Login = () => {
  const [valores, setValores] = useState({
    identificador: "homero",
    password: "miclave",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("valores", valores);
    try {
      const resultado = await loginApi(valores);

      const token = resultado.token;

      console.log("token", token);
      window.localStorage.setItem("token", token);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const auxValores = { ...valores };
    const name = e.target.name;
    const type = e.target.type;
    //aca hay que saber el type para saber si es un checkbox u otro tipo
    const value = type == "checkbox" ? e.target.checked : e.target.value;
    auxValores[name] = value; //se usa para saber quien ejecuto el evento
    console.log("auxValores", auxValores);
    setValores(auxValores);
  };

  return (
    <Card style={{ width: "18rem", justifyContent: "center" }}>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="identificador"
              value={valores.identificador}
              placeholder="Enter email"
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={valores.password}
              placeholder="Password"
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" onClick={onSubmit}>
            Submit
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Login;
