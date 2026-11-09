import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import { restoreSession } from "../redux/features/authSlice.js";

const Rutas = () => {
  const dispatch = useDispatch();
  const { token, user, restoring } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) dispatch(restoreSession());
  }, [dispatch, token, user]);

  const protectedDashboard = token ? (
    restoring || !user ? (
      <main className="session-loading" role="status">
        Restaurando tu sesión...
      </main>
    ) : (
      <Dashboard />
    )
  ) : (
    <Navigate to="/login" replace />
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={
            token ? <Navigate to="/dashboard" replace /> : <Register />
          }
        />
        <Route path="/dashboard" element={protectedDashboard} />
        <Route
          path="*"
          element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Rutas;
