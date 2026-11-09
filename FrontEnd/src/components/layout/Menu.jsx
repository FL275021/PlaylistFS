import { Col, Container, Row } from "react-bootstrap";
import { useLogout } from "../../hooks/useLogout.js";

const Menu = () => {
  const logout = useLogout();

  return (
    <Container className="menu">
      <Row>
        <Col>
          <h2>Tareas</h2>
        </Col>
        <Col>
          <button onClick={logout}>Logout</button>
        </Col>
      </Row>
    </Container>
  );
};

export default Menu;
