import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CreditCard, QrCode, ShieldCheck } from "lucide-react";
import { formatCurrency } from "../../../../shared/formatters/currency";
import { useCheckoutFlow } from "../context/CheckoutFlowContext";
import { CheckinFlowLayout } from "../../checkin-flow/components/CheckinFlowLayout";
import { FlowStepHeader } from "../../checkin-flow/components/FlowStepHeader";
import { MethodOptionCard } from "../../checkin-flow/components/MethodOptionCard";

function getChargeLabel(code: string, description: string, translate: (key: string, options?: Record<string, string>) => string) {
  if (code === "LATE_CHECKOUT") {
    return translate("settlementLateCheckout");
  }

  return description;
}

export function SummaryPage() {
  const { t, i18n } = useTranslation("checkout");
  const navigate = useNavigate();
  const { stayPreview, paymentMethod, setPaymentMethod, completeCheckout, isLoading, setFlowStep } = useCheckoutFlow();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!stayPreview) {
      navigate("/checkout", { replace: true });
      return;
    }

    setFlowStep("settlement");
  }, [navigate, setFlowStep, stayPreview]);

  if (!stayPreview) {
    return null;
  }

  const reservation = stayPreview.reservation;
  const baseAmount = formatCurrency(reservation.totalAmount, reservation.currency, i18n.language);
  const totalDue = formatCurrency(stayPreview.totalDue, reservation.currency, i18n.language);
  const hasBalance = stayPreview.totalDue > 0;
  const hasCharges = stayPreview.charges.length > 0;

  const finalizeCheckout = async () => {
    setIsProcessing(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 900));
      await completeCheckout();
      navigate("/checkout/success");
    } catch {
      navigate("/checkout/recovery", { replace: true });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <CheckinFlowLayout>
      <section className="checkout-settlement" aria-label={t("settlementTitle")}>
        <FlowStepHeader
          step={t("stepSettlement")}
          title={t("settlementTitle")}
          subtitle={t("settlementSubtitle")}
        />

        <div className="checkout-settlement__layout">
          <article className="checkout-settlement__card checkout-settlement__balance-card">
            <div className="checkout-settlement__badge">
              <ShieldCheck />
              <span>{t("settlementSecurityLabel")}</span>
            </div>
            <p className="checkout-settlement__eyebrow">{t("settlementFinalReview")}</p>
            <h2>{t("settlementBalanceTitle")}</h2>

            <div className="checkout-settlement__line">
              <span>{t("settlementReservationPaid")}</span>
              <strong>{baseAmount}</strong>
            </div>

            <div className="checkout-settlement__charges" aria-label={t("settlementChargesTitle")}>
              <span>{t("settlementChargesTitle")}</span>
              {hasCharges ? (
                stayPreview.charges.map((charge) => (
                  <div className="checkout-settlement__charge" key={charge.code}>
                    <small>{getChargeLabel(charge.code, charge.description, t)}</small>
                    <strong>{formatCurrency(charge.amount, reservation.currency, i18n.language)}</strong>
                  </div>
                ))
              ) : (
                <p>{t("settlementNoCharges")}</p>
              )}
            </div>

            <div className="checkout-settlement__total">
              <span>{t("settlementTotalDue")}</span>
              <strong>{totalDue}</strong>
            </div>

            <p className="checkout-settlement__room-note">
              {t("settlementRoomNote", { room: reservation.room.number })}
            </p>
          </article>

          <article className="checkout-settlement__card checkout-settlement__payment-card">
            <p className="checkout-settlement__eyebrow">{t("settlementPaymentEyebrow")}</p>
            <h2>{hasBalance ? t("settlementPaymentTitle") : t("settlementNoPaymentTitle")}</h2>
            <p className="checkout-settlement__copy">
              {hasBalance ? t("settlementPaymentCopy") : t("settlementNoPaymentCopy")}
            </p>

            <div className="checkout-settlement__methods">
              <MethodOptionCard
                title={t("paymentCardTitle")}
                subtitle={t("paymentCardSubtitle")}
                icon={<CreditCard />}
                selected={paymentMethod === "CARD"}
                onClick={() => setPaymentMethod("CARD")}
              />
              <MethodOptionCard
                title={t("paymentPixTitle")}
                subtitle={t("paymentPixSubtitle")}
                icon={<QrCode />}
                selected={paymentMethod === "PIX"}
                onClick={() => setPaymentMethod("PIX")}
              />
            </div>
          </article>
        </div>

        {isProcessing ? (
          <div className="checkout-settlement__processing" role="status" aria-live="polite">
            <span className="checkout-settlement__spinner" aria-hidden="true" />
            <strong>{hasBalance ? t("settlementProcessingPayment") : t("settlementClosingStay")}</strong>
          </div>
        ) : null}

        <div className="checkin-payment__actions checkout-settlement__actions">
          <button
            type="button"
            className="checkin-action-button checkin-action-button--secondary"
            onClick={() => navigate("/checkout")}
            disabled={isLoading || isProcessing}
          >
            {t("back")}
          </button>
          <button
            type="button"
            className="checkin-action-button checkin-action-button--primary"
            onClick={finalizeCheckout}
            disabled={isLoading || isProcessing}
          >
            {hasBalance ? t("settlementPayAndClose") : t("settlementCloseStay")}
          </button>
        </div>
      </section>
    </CheckinFlowLayout>
  );
}
