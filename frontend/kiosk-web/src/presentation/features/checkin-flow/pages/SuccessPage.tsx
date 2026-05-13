import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/Button";
import { useCheckinFlow } from "../context/CheckinFlowContext";
import { CheckinFlowLayout } from "../components/CheckinFlowLayout";
import { FlowStepHeader } from "../components/FlowStepHeader";

export function SuccessPage() {
  const { t, i18n } = useTranslation("checkin");
  const navigate = useNavigate();
  const { reservation, checkinResult, clearFlow } = useCheckinFlow();

  useEffect(() => {
    if (!reservation || !checkinResult) {
      navigate("/", { replace: true });
    }
  }, [checkinResult, navigate, reservation]);

  if (!reservation || !checkinResult) {
    return null;
  }

  const locale = i18n.language === "pt-BR" ? "pt-BR" : i18n.language === "es" ? "es-ES" : "en-US";
  const totalPaid = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: reservation.currency,
  }).format(checkinResult.totalPaid);

  const concludeFlow = () => {
    clearFlow();
    navigate("/", { replace: true });
  };

  return (
    <CheckinFlowLayout
      topRightContent={<span className="checkin-topbar__confirmation-label">{t("successTag")}</span>}
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
      <section className="checkin-success" aria-label={t("successTitle")}>
        <div className="checkin-success__badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5.5 12.5 9.5 16.5 18.5 7.5" />
            <circle cx="12" cy="12" r="8.2" />
          </svg>
        </div>

        <FlowStepHeader
          step={t("stepSuccess")}
          title={t("successTitle")}
          subtitle={t("successSubtitle")}
        />

        <div className="checkin-success__grid">
          <article className="checkin-success__card">
            <span>{t("successRoomLabel")}</span>
            <strong>{checkinResult.roomNumber}</strong>
          </article>
          <article className="checkin-success__card">
            <span>{t("successKeyLabel")}</span>
            <strong>{checkinResult.key.value}</strong>
          </article>
          <article className="checkin-success__card">
            <span>{t("successPaidLabel")}</span>
            <strong>{totalPaid}</strong>
          </article>
        </div>

        <p className="checkin-success__copy">{t("successCopy")}</p>

        <div className="checkin-success__actions">
          <Button variant="primary" size="lg" onClick={concludeFlow}>
            {t("finishAndReturn")}
          </Button>
        </div>
      </section>
    </CheckinFlowLayout>
  );
}
