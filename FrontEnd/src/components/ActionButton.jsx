import { useState } from "react";

// Botón que ejecuta una acción del hook y se bloquea mientras espera.
export default function ActionButton({ action, run, variant, children }) {
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    setBusy(true);
    try {
      await run(action);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={variant || undefined}
      disabled={busy}
      onClick={onClick}
    >
      {busy ? "Consultando..." : children}
    </button>
  );
}
