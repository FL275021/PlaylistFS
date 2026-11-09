import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login.jsx";
import Dashboard from "./auth/Dashboard.jsx";
import Menu from "./layout/Menu.jsx";
import Contenido from "./Contenido.jsx";

const Rutas = () => (
  <BrowserRouter>
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="dashboard" element={<Dashboard />}>
        <Route index element={<Menu />} />
        <Route path="contenido" element={<Contenido />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default Rutas;
