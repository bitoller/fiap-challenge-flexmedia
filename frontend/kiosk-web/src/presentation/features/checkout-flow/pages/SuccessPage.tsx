import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/Button";
import { useCheckoutFlow } from "../context/CheckoutFlowContext";
import { CheckoutFlowLayout } from "../components/CheckoutFlowLayout";
import { CheckoutStepHeader } from "../components/CheckoutStepHeader";

export function SuccessPage() {
  const { t } = useTranslation("checkout");
  const navigate = useNavigate();
  const { checkoutResult, clearFlow } = useCheckoutFlow();

  useEffect(() => {
    if (!checkoutResult) {
      navigate("/checkout", { replace: true });
    }
  }, [checkoutResult, navigate]);

  if (!checkoutResult) {
    return null;
  }

  const conclude = () => {
    clearFlow();
    navigate("/", { replace: true });
  };

  return (
    <CheckoutFlowLayout>
      <section className="checkout-success" aria-label={t("successTitle")}>
        <div className="checkout-success__hero" aria-hidden="true" />

        <div className="checkout-success__content">
          <CheckoutStepHeader step={t("stepSuccess")} title={t("successTitle")} subtitle={t("successSubtitle")} />

          <div className="checkout-success__receipt">
            <span>{t("successReceiptLabel")}</span>
            <strong>{checkoutResult.receiptCode}</strong>
          </div>

          <p className="checkout-success__copy">{t("successCopy")}</p>

          <div className="checkout-success__actions">
            <Button variant="primary" size="lg" onClick={conclude}>
              {t("successEndButton")}
            </Button>
            <a href="#download" className="checkout-success__link">
              {t("successDownload")}
            </a>
          </div>
        </div>
      </section>
    </CheckoutFlowLayout>
  );
}
