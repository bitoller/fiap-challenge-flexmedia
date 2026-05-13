import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/Button";
import { useCheckoutFlow } from "../context/CheckoutFlowContext";
import { CheckoutFlowLayout } from "../components/CheckoutFlowLayout";
import { CheckoutStepHeader } from "../components/CheckoutStepHeader";
import { CheckoutChargeList } from "../components/CheckoutChargeList";

function formatDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatCurrency(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

function getNights(arrivalDate: string, departureDate: string) {
  const start = new Date(`${arrivalDate}T00:00:00`);
  const end = new Date(`${departureDate}T00:00:00`);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export function SummaryPage() {
  const { t, i18n } = useTranslation("checkout");
  const navigate = useNavigate();
  const { stayPreview, setFlowStep } = useCheckoutFlow();

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

  const reservation = stayPreview.reservation;
  const totalAmount = formatCurrency(stayPreview.totalDue, reservation.currency, locale);
  const arrivalDate = formatDate(reservation.arrivalDate, locale);
  const departureDate = formatDate(reservation.departureDate, locale);
  const nights = getNights(reservation.arrivalDate, reservation.departureDate);

  const proceed = () => {
    setFlowStep("payment");
    navigate("/checkout/payment");
  };

  const dispute = () => {
    setFlowStep("reconciliation");
    navigate("/checkout/reconciliation");
  };

  return (
    <CheckoutFlowLayout>
      <section className="checkout-summary" aria-label={t("summaryTitle")}>
        <CheckoutStepHeader step={t("stepSummary")} title={t("summaryTitle")} subtitle={t("summarySubtitle")} />

        <div className="checkout-summary__layout">
          <article className="checkout-summary__folio">
            <header className="checkout-summary__folio-head">
              <div>
                <span>{t("summaryRoomLabel", { room: reservation.room.number })}</span>
                <strong>{t("summaryFolioTitle")}</strong>
              </div>
              <small>{t("summaryDateLabel", { date: arrivalDate })}</small>
            </header>

            <CheckoutChargeList charges={stayPreview.charges} currency={reservation.currency} locale={locale} />

            <div className="checkout-summary__total">
              <div>
                <span>{t("summaryTotalLabel")}</span>
                <small>{t("summaryTaxCopy")}</small>
              </div>
              <strong>{totalAmount}</strong>
            </div>
          </article>

          <aside className="checkout-summary__aside">
            <div className="checkout-summary__image-card">
              <div className="checkout-summary__image-copy">
                <span>{t("summaryGuestExperience")}</span>
                <strong>{t("summaryGuestCopy")}</strong>
              </div>
            </div>

            <div className="checkout-summary__info-card">
              <span>{t("summaryStayLabel")}</span>
              <strong>{reservation.guest.fullName}</strong>
              <small>{t("summaryNights", { count: nights })}</small>
              <small>{arrivalDate} - {departureDate}</small>
            </div>

            <div className="checkout-summary__actions">
              <Button variant="secondary" size="lg" onClick={dispute}>
                {t("summaryDispute")}
              </Button>
              <Button variant="primary" size="lg" onClick={proceed}>
                {t("summaryContinue")}
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </CheckoutFlowLayout>
  );
}
