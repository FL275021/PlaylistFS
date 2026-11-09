import { Col, Container, Row } from "react-bootstrap";
import { useCargaInicial } from "../hooks/useCargaInicial.js";
import Agregar from "./tareas/Agregar.jsx";
import Tareas from "./tareas/Tareas.jsx";
import MiGrafica from "./graficas/MiGrafica.jsx";

const Contenido = () => {
  useCargaInicial();

  return (
    <div className="contenido">
      <Agregar />
      <Container>
        <Row>
          <Col>
            <MiGrafica />
          </Col>
          <Col>
            <Tareas />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contenido;
