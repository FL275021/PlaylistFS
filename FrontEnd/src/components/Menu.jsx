import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();
  const handlerLogout = (e) => {
    window.localStorage.clear();
    navigate("/login");
  };

  return (
    <Container className="menu">
      <Row>
        <Col>
          <h2>Tareas</h2>
        </Col>
        <Col>
          <button onClick={handlerLogout}>Logout</button>
        </Col>
      </Row>
    </Container>
  );
};

export default Menu;
