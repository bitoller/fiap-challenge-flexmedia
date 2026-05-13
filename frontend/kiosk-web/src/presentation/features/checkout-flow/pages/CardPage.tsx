import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/Button";
import { useCheckoutFlow } from "../context/CheckoutFlowContext";
import { CheckoutFlowLayout } from "../components/CheckoutFlowLayout";
import { CheckoutStepHeader } from "../components/CheckoutStepHeader";

export function CardPage() {
  const { t } = useTranslation("checkout");
  const navigate = useNavigate();
  const { stayPreview, paymentMethod, completeCheckout, isLoading } = useCheckoutFlow();

  useEffect(() => {
    if (!stayPreview) {
      navigate("/checkout", { replace: true });
    }
  }, [navigate, stayPreview]);

  if (!stayPreview) {
    return null;
  }

  const continueCheckout = async () => {
    try {
      await completeCheckout();
      navigate("/checkout/receipt");
    } catch {
      navigate("/checkout/recovery", { replace: true });
    }
  };

  const title = paymentMethod === "PIX" ? t("cardPixTitle") : t("cardTitle");
  const subtitle = paymentMethod === "PIX" ? t("cardPixSubtitle") : t("cardSubtitle");

  return (
    <CheckoutFlowLayout>
      <section className="checkout-card" aria-label={title}>
        <CheckoutStepHeader step={t("stepCard")} title={title} subtitle={subtitle} />

        <div className="checkout-card__stage">
          <div className="checkout-card__device" aria-hidden="true">
            <div className="checkout-card__slot" />
            <div className="checkout-card__illustration">
              {paymentMethod === "PIX" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7zM14 14h3v3h-3z" />
                  <path d="M11 11h2M11 14h2M14 11h2" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3.8" y="6.5" width="16.4" height="11" rx="2.2" />
                  <path d="M3.8 10h16.4" />
                  <path d="M8 14.5h4.2" />
                </svg>
              )}
            </div>
          </div>

          <p className="checkout-card__copy">{t("cardInstruction")}</p>
          <Button variant="primary" size="lg" onClick={continueCheckout} isLoading={isLoading}>
            {t("cardContinue")}
          </Button>
        </div>
      </section>
    </CheckoutFlowLayout>
  );
}
