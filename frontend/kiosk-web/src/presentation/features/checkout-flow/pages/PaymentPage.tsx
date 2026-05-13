import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCheckoutFlow } from "../context/CheckoutFlowContext";
import { CheckoutFlowLayout } from "../components/CheckoutFlowLayout";
import { CheckoutStepHeader } from "../components/CheckoutStepHeader";
import { CheckoutMethodCard } from "../components/CheckoutMethodCard";
import { Button } from "../../../components/common/Button";
import { CheckoutPaymentMethod } from "../../../../domain/types";

function formatCurrency(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

export function PaymentPage() {
  const { t, i18n } = useTranslation("checkout");
  const navigate = useNavigate();
  const { stayPreview, paymentMethod: persistedPaymentMethod, setPaymentMethod, setFlowStep } = useCheckoutFlow();
  const [paymentMethod, setPaymentMethodState] = useState<CheckoutPaymentMethod>(persistedPaymentMethod);

  useEffect(() => {
    if (!stayPreview) {
      navigate("/checkout", { replace: true });
    }
  }, [navigate, stayPreview]);

  const locale = useMemo(() => {
    if (i18n.language === "pt-BR") return "pt-BR";
    if (i18n.language === "es") return "es-ES";
    return "en-US";
  }, [i18n.language]);

  if (!stayPreview) {
    return null;
  }

  const totalAmount = formatCurrency(stayPreview.totalDue, stayPreview.reservation.currency, locale);

  const confirmPayment = () => {
    setPaymentMethod(paymentMethod);
    setFlowStep("card");
    navigate("/checkout/card");
  };

  return (
    <CheckoutFlowLayout>
      <section className="checkout-payment" aria-label={t("paymentTitle")}>
        <CheckoutStepHeader step={t("stepPayment")} title={t("paymentTitle")} subtitle={t("paymentSubtitle")} />

        <div className="checkout-payment__layout">
          <div className="checkout-payment__methods">
            <CheckoutMethodCard
              title={t("paymentCardTitle")}
              subtitle={t("paymentCardSubtitle")}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="6.5" width="16" height="11" rx="1.5" />
                  <path d="M4 10h16" />
                  <path d="M8 14.2h3.5" />
                </svg>
              }
              selected={paymentMethod === "CARD"}
              onClick={() => {
                setPaymentMethodState("CARD");
                setPaymentMethod("CARD");
              }}
            />

            <CheckoutMethodCard
              title={t("paymentPixTitle")}
              subtitle={t("paymentPixSubtitle")}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7z" />
                  <path d="M14 14h3v3h-3z" />
                  <path d="M11 11h2M11 14h2M14 11h2" />
                </svg>
              }
              selected={paymentMethod === "PIX"}
              onClick={() => {
                setPaymentMethodState("PIX");
                setPaymentMethod("PIX");
              }}
            />

            <div className="checkout-payment__hero">
              <div className="checkout-payment__hero-copy">
                <span>{t("paymentSecureLabel")}</span>
                <strong>{totalAmount}</strong>
                <p>{t("paymentHeroCopy")}</p>
              </div>
            </div>
          </div>

          <aside className="checkout-payment__summary">
            <div className="checkout-payment__summary-card">
              <span>{t("paymentSummaryTitle")}</span>
              <CheckoutMethodCard
                title={t("paymentCardTitle")}
                subtitle={t("paymentCardSubtitle")}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="6.5" width="16" height="11" rx="1.5" />
                    <path d="M4 10h16" />
                  </svg>
                }
                selected={paymentMethod === "CARD"}
              onClick={() => {
                setPaymentMethodState("CARD");
                setPaymentMethod("CARD");
              }}
            />
              <CheckoutMethodCard
                title={t("paymentPixTitle")}
                subtitle={t("paymentPixSubtitle")}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7z" />
                    <path d="M14 14h3v3h-3z" />
                  </svg>
                }
                selected={paymentMethod === "PIX"}
              onClick={() => {
                setPaymentMethodState("PIX");
                setPaymentMethod("PIX");
              }}
            />

              <div className="checkout-payment__summary-total">
                <span>{t("paymentTotalLabel")}</span>
                <strong>{totalAmount}</strong>
              </div>

              <Button variant="primary" size="lg" onClick={confirmPayment}>
                {t("paymentConfirm")}
              </Button>
              <small>{t("paymentSummaryCopy")}</small>
            </div>
          </aside>
        </div>

        <div className="checkout-payment__actions">
          <Button variant="secondary" size="lg" onClick={() => navigate("/checkout/summary")}>
            {t("back")}
          </Button>
        </div>
      </section>
    </CheckoutFlowLayout>
  );
}
