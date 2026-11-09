import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  return () => {
    window.localStorage.clear();
    navigate("/login");
  };
};
