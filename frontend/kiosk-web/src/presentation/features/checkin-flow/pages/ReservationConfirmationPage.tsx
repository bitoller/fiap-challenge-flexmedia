import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, BadgeCheck } from "lucide-react";
import { useCheckinFlow } from "../context/CheckinFlowContext";
import { CheckinFlowLayout } from "../components/CheckinFlowLayout";
import { FlowStepHeader } from "../components/FlowStepHeader";

function formatDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatCurrency(amount: number, currency: string, locale: string) {
  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).formatToParts(amount);

  if (locale.startsWith("en")) {
    const currencyIndex = parts.findIndex((part) => part.type === "currency");
    const integerIndex = parts.findIndex((part) => part.type === "integer");

    if (currencyIndex !== -1 && integerIndex !== -1 && currencyIndex < integerIndex) {
      const formatted: string[] = [];

      parts.forEach((part, index) => {
        formatted.push(part.value);
        if (index === currencyIndex) {
          formatted.push("\u00A0");
        }
      });

      return formatted.join("");
    }
  }

  return parts.map((part) => part.value).join("");
}

function getStayNights(arrivalDate: string, departureDate: string) {
  const start = new Date(`${arrivalDate}T00:00:00`);
  const end = new Date(`${departureDate}T00:00:00`);
  const diff = end.getTime() - start.getTime();

  if (!Number.isFinite(diff) || diff <= 0) {
    return 1;
  }

  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function humanizeCode(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function ReservationConfirmationPage() {
  const { t, i18n } = useTranslation("checkin");
  const navigate = useNavigate();
  const { reservation, setFlowStep, setRecovery } = useCheckinFlow();

  useEffect(() => {
    if (!reservation) {
      navigate("/checkin", { replace: true });
    }
  }, [navigate, reservation]);

  const locale = useMemo(() => {
    if (i18n.language === "pt-BR") return "pt-BR";
    if (i18n.language === "es") return "es-ES";
    return "en-US";
  }, [i18n.language]);

  if (!reservation) {
    return null;
  }

  const totalAmount = formatCurrency(reservation.totalAmount, reservation.currency, locale);
  const arrivalDate = formatDate(reservation.arrivalDate, locale);
  const departureDate = formatDate(reservation.departureDate, locale);
  const nights = getStayNights(reservation.arrivalDate, reservation.departureDate);

  const confirmReservation = () => {
    if (!reservation.eligible) {
      const recoveryCode = reservation.eligibilityReasons.some((reason) =>
        ["INVALID_DOCUMENT", "INVALID_DOCUMENT_TYPE", "DOCUMENT_MISMATCH"].includes(reason)
      )
        ? "DOCUMENT_REJECTED"
        : "BIOMETRY_REJECTED";

      setRecovery(recoveryCode, t("reservationNotEligible"));
      navigate("/checkin/recovery", { replace: true, state: { code: recoveryCode, message: t("reservationNotEligible") } });
      return;
    }

    setFlowStep("identity-verification");
    navigate("/checkin/identity");
  };

  return (
    <CheckinFlowLayout>
      <section className="checkin-confirmation" aria-label={t("confirmationTitle")}>
        <FlowStepHeader
          step={t("stepConfirmation")}
          title={t("confirmationTitle")}
          subtitle={t("confirmationSubtitle")}
        />

        <div className="checkin-confirmation__layout">
          <article className="checkin-confirmation__details">
            <h2>{t("stayDetailsTitle")}</h2>
            <div className="checkin-confirmation__divider" aria-hidden="true" />

            <div className="checkin-confirmation__field">
              <span>{t("primaryGuestLabel")}</span>
              <strong>{reservation.guest.fullName}</strong>
            </div>

            <div className="checkin-confirmation__grid">
              <div className="checkin-confirmation__mini-field">
                <span>{t("arrivalLabel")}</span>
                <strong>{arrivalDate}</strong>
              </div>
              <div className="checkin-confirmation__mini-field">
                <span>{t("departureLabel")}</span>
                <strong>{departureDate}</strong>
              </div>
            </div>

            <div className="checkin-confirmation__divider" aria-hidden="true" />

            <div className="checkin-confirmation__field">
              <span>{t("roomLabel")}</span>
               <strong>{t(`roomTypes.${reservation.room.type}`, { defaultValue: humanizeCode(reservation.room.type) })}</strong>
              <small>{t("roomNumber", { number: reservation.room.number })}</small>
            </div>

            <div className="checkin-confirmation__notes">
              {reservation.eligible ? (
                <p>{t("reservationEligible")}</p>
              ) : (
                <p>{t("reservationNotEligible")}</p>
              )}
            </div>
          </article>

          <aside className="checkin-confirmation__aside">
            <div className="checkin-confirmation__summary-card" aria-label={t("summaryVisualAriaLabel")}>
              <div className="checkin-confirmation__summary-card-badge" aria-hidden="true">
                <BadgeCheck />
              </div>
              <p className="checkin-confirmation__summary-card-eyebrow">{t("summaryVisualEyebrow")}</p>
              <h3 className="checkin-confirmation__summary-card-title">{t("summaryVisualTitle")}</h3>
              <p className="checkin-confirmation__summary-card-copy">{t("summaryVisualBody")}</p>
              <div className="checkin-confirmation__summary-card-stat">
                <span>{t("durationLabel")}</span>
                <strong>{t("nightsValue", { count: nights })}</strong>
              </div>
              <div className="checkin-confirmation__summary-card-chip">{t("summaryVisualChip")}</div>
            </div>

            <div className="checkin-confirmation__total-card">
              <div>
                <span>{t("totalReservationLabel")}</span>
                <small>{t("taxesIncluded")}</small>
              </div>
              <strong>{totalAmount}</strong>
            </div>
          </aside>
        </div>

        <div className="checkin-confirmation__actions">
          <button type="button" className="checkin-action-button checkin-action-button--ghost" onClick={() => navigate("/checkin")}>
            <ArrowLeft aria-hidden="true" />
            {t("back")}
          </button>
          <button type="button" className="checkin-action-button checkin-action-button--primary checkin-action-button--wide" onClick={confirmReservation}>
            {t("confirmReservation")}
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </section>
    </CheckinFlowLayout>
  );
}
