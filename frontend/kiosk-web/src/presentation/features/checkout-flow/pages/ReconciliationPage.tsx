import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/Button";
import { useCheckoutFlow } from "../context/CheckoutFlowContext";
import { CheckoutFlowLayout } from "../components/CheckoutFlowLayout";
import { CheckoutStepHeader } from "../components/CheckoutStepHeader";

export function ReconciliationPage() {
  const { t } = useTranslation("checkout");
  const navigate = useNavigate();
  const { stayPreview, setFlowStep } = useCheckoutFlow();

  useEffect(() => {
    if (!stayPreview) {
      navigate("/checkout", { replace: true });
    }
  }, [navigate, stayPreview]);

  if (!stayPreview) {
    return null;
  }

  const continueFlow = () => {
    setFlowStep("payment");
    navigate("/checkout/payment");
  };

  const askHelp = () => {
    navigate("/services");
  };

  return (
    <CheckoutFlowLayout>
      <section className="checkout-reconciliation" aria-label={t("reconciliationTitle")}>
        <div className="checkout-reconciliation__media">
          <div className="checkout-reconciliation__art" aria-hidden="true" />
          <div className="checkout-reconciliation__tag">{t("reconciliationTag")}</div>
        </div>

        <div className="checkout-reconciliation__content">
          <CheckoutStepHeader step={t("stepReconciliation")} title={t("reconciliationTitle")} subtitle={t("reconciliationSubtitle")} />

          <p className="checkout-reconciliation__body">{t("reconciliationBody")}</p>

          <div className="checkout-reconciliation__actions">
            <Button variant="primary" size="lg" onClick={askHelp}>
              {t("reconciliationHelpAction")}
            </Button>
            <Button variant="secondary" size="lg" onClick={continueFlow}>
              {t("reconciliationContinue")}
            </Button>
          </div>
        </div>
      </section>
    </CheckoutFlowLayout>
  );
}
