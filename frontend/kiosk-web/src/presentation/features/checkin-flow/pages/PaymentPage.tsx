import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/Button";
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
  const totalAmount = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: reservation.currency,
  }).format(reservation.totalAmount);

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
    <CheckinFlowLayout
      topRightContent={<span className="checkin-topbar__confirmation-label">{t("paymentTag")}</span>}
      bottomItems={[
        {
          key: "home",
          label: t("bottomHomeCompact"),
          icon: "home",
          onClick: () => navigate("/"),
        },
        {
          key: "assistant",
          label: t("bottomAssistant"),
          icon: "assistant",
          active: true,
        },
        {
          key: "emergency",
          label: t("bottomEmergency"),
          icon: "emergency",
        },
      ]}
    >
      <section className="checkin-payment" aria-label={t("paymentTitle")}>
        <FlowStepHeader
          step={t("stepPayment")}
          title={t("paymentTitle")}
          subtitle={t("paymentSubtitle")}
        />

        <div className="checkin-payment__summary">
          <div>
            <span>{t("paymentTotalLabel")}</span>
            <strong>{totalAmount}</strong>
          </div>
          <small>{t("paymentSafeLabel")}</small>
        </div>

        <div className="checkin-payment__methods">
          <MethodOptionCard
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
            onClick={() => setPaymentMethodState("CARD")}
          />
          <MethodOptionCard
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
            onClick={() => setPaymentMethodState("PIX")}
          />
        </div>

        <div className="checkin-payment__actions">
          <Button variant="secondary" size="lg" onClick={() => navigate("/checkin/identity")}>
            {t("back")}
          </Button>
          <Button variant="primary" size="lg" onClick={finishCheckin} isLoading={isLoading}>
            {t("finalize")}
          </Button>
        </div>
      </section>
    </CheckinFlowLayout>
  );
}
