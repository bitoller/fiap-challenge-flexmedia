import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CreditCard, QrCode, ShieldCheck, Sparkles } from "lucide-react";
import { ApiError } from "../../../../domain/errors";
import { CheckinPaymentMethod } from "../../../../domain/types";
import { useCheckinFlow } from "../context/CheckinFlowContext";
import { CheckinFlowLayout } from "../components/CheckinFlowLayout";
import { FlowStepHeader } from "../components/FlowStepHeader";
import { MethodOptionCard } from "../components/MethodOptionCard";

export function PaymentPage() {
  const { t, i18n } = useTranslation("checkin");
  const navigate = useNavigate();
  const {
    reservation,
    addOnQuote,
    paymentMethod: persistedPaymentMethod,
    completeCheckin,
    isLoading,
    setRecovery,
    setPaymentMethod,
  } = useCheckinFlow();
  const [paymentMethod, setPaymentMethodState] = useState<CheckinPaymentMethod>(persistedPaymentMethod ?? "CARD");

  useEffect(() => {
    setPaymentMethod(paymentMethod);
  }, [paymentMethod, setPaymentMethod]);

  useEffect(() => {
    if (!reservation) {
      navigate("/checkin", { replace: true });
    }
  }, [navigate, reservation]);

  if (!reservation) {
    return null;
  }

  const locale = i18n.language === "pt-BR" ? "pt-BR" : i18n.language === "es" ? "es-ES" : "en-US";
  const paymentBaseAmount = addOnQuote?.baseAmount ?? reservation.totalAmount;
  const paymentServicesAmount = addOnQuote?.addOnsTotal ?? 0;
  const paymentTotalAmount = paymentBaseAmount + paymentServicesAmount;
  const totalAmount = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: reservation.currency,
  }).format(paymentTotalAmount);
  const baseAmount = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: reservation.currency,
  }).format(paymentBaseAmount);
  const servicesAmount = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: reservation.currency,
  }).format(paymentServicesAmount);

  const finishCheckin = async () => {
    try {
      await completeCheckin(paymentMethod);
      navigate("/checkin/success");
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null;
      const code = "PAYMENT_DECLINED";
      setRecovery(code, apiError?.message ?? t("paymentErrorBody"));
      navigate("/checkin/recovery", {
        replace: true,
        state: { code, message: apiError?.message },
      });
    }
  };

  return (
    <CheckinFlowLayout>
      <section className="checkin-payment" aria-label={t("paymentTitle")}>
        <FlowStepHeader
          step={t("stepPayment")}
          title={t("paymentTitle")}
          subtitle={t("paymentSubtitle")}
        />

        <div className="checkin-payment__layout">
          <article className="checkin-payment__folio" aria-label={t("paymentSummaryTitle")}>
            <div className="checkin-payment__folio-header">
              <div>
                <span>{t("paymentSummaryEyebrow")}</span>
                <h2>{t("paymentSummaryTitle")}</h2>
              </div>
              <ShieldCheck aria-hidden="true" />
            </div>

            <dl className="checkin-payment__lines">
              <div>
                <dt>{t("paymentReservationLine")}</dt>
                <dd>{baseAmount}</dd>
              </div>
              <div>
                <dt>{t("paymentServicesLine")}</dt>
                <dd>{servicesAmount}</dd>
              </div>
              <div className="is-total">
                <dt>{t("paymentTotalLabel")}</dt>
                <dd>{totalAmount}</dd>
              </div>
            </dl>

            <p>{t("paymentSummaryNote", { room: reservation.room.number })}</p>
          </article>

          <aside className="checkin-payment__side">
            <div className="checkin-payment__secure">
              <Sparkles aria-hidden="true" />
              <div>
                <span>{t("paymentSafeLabel")}</span>
                <strong>{t("paymentAccessNext")}</strong>
              </div>
            </div>

            <div className="checkin-payment__methods">
              <MethodOptionCard
                title={t("paymentCardTitle")}
                subtitle={t("paymentCardSubtitle")}
                icon={<CreditCard aria-hidden="true" />}
                selected={paymentMethod === "CARD"}
                onClick={() => setPaymentMethodState("CARD")}
              />
              <MethodOptionCard
                title={t("paymentPixTitle")}
                subtitle={t("paymentPixSubtitle")}
                icon={<QrCode aria-hidden="true" />}
                selected={paymentMethod === "PIX"}
                onClick={() => setPaymentMethodState("PIX")}
              />
            </div>
          </aside>
        </div>

        {isLoading && (
          <div className="checkin-payment__processing" role="status" aria-live="polite">
            <span aria-hidden="true" />
            <div>
              <strong>{t("paymentProcessingTitle")}</strong>
              <small>{t("paymentProcessingBody")}</small>
            </div>
          </div>
        )}

        <div className="checkin-payment__actions">
          <button
            type="button"
            className="checkin-action-button checkin-action-button--ghost"
            onClick={() => navigate("/checkin/add-ons")}
          >
            {t("back")}
          </button>
          <button
            type="button"
            className="checkin-action-button checkin-action-button--primary"
            onClick={finishCheckin}
            disabled={isLoading}
          >
            {isLoading ? t("paymentProcessingTitle") : t("finalize")}
          </button>
        </div>
      </section>
    </CheckinFlowLayout>
  );
}
