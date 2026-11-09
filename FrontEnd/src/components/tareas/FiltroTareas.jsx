import { useId } from "react";
import { useDispatch } from "react-redux";
import { modificarSearchSlice } from "../../redux/features/tareasSlice.js";

const FiltroTareas = () => {
  const dispatch = useDispatch();
  const id = useId();

  return (
    <>
      <label htmlFor={id}></label>
      <input
        type="text"
        id={id}
        onChange={(e) => dispatch(modificarSearchSlice(e.target.value))}
      />
    </>
  );
};

export default FiltroTareas;
