import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "./redux/store";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Rutas from "./components/Rutas.jsx";
import SpinnerGlobal from "./components/layout/SpinnerGlobal.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <SpinnerGlobal />
    <ToastContainer />
    <Rutas />
  </Provider>,
);
