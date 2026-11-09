const PlanUpgrade = ({ plan, isUpgrading, onUpgrade }) => {
  const isPremium = plan === "premium";

  const confirmUpgrade = () => {
    if (
      window.confirm(
        "Vas a cambiar tu cuenta al plan Premium. Esta acción no se puede revertir desde la aplicación. ¿Continuar?",
      )
    ) {
      onUpgrade();
    }
  };

  return (
    <section className="upgrade-panel" aria-labelledby="upgrade-title">
      <div>
        <p className="eyebrow">MÁS ESPACIO PARA TU MÚSICA</p>
        <h2 id="upgrade-title">
          {isPremium ? "Ya tienes Premium" : "Mejorá tu plan"}
        </h2>
        <p>
          {isPremium
            ? "Tu cuenta ya puede crear playlists sin el límite del plan Plus."
            : "Pasá a Premium para crear playlists sin el límite del plan Plus."}
        </p>
      </div>
      {!isPremium && (
        <button
          className="button button-primary"
          type="button"
          onClick={confirmUpgrade}
          disabled={isUpgrading || !plan}
        >
          {isUpgrading ? "Actualizando plan..." : "Pasar a Premium"}
        </button>
      )}
    </section>
  );
};

export default PlanUpgrade;
