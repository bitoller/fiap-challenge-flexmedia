import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CreditCard, MailCheck, ReceiptText, RotateCcw, Sparkles } from "lucide-react";
import { useCheckoutFlow } from "../context/CheckoutFlowContext";
import { CheckinFlowLayout } from "../../checkin-flow/components/CheckinFlowLayout";
import { FlowStepHeader } from "../../checkin-flow/components/FlowStepHeader";

function getLocale(language: string) {
  if (language === "pt-BR") return "pt-BR";
  if (language === "es") return "es-ES";
  return "en-US";
}

function formatCurrency(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

export function SuccessPage() {
  const { t, i18n } = useTranslation("checkout");
  const navigate = useNavigate();
  const { checkoutResult, stayPreview, clearFlow, setFlowStep } = useCheckoutFlow();
  const [receiptConfirmed, setReceiptConfirmed] = useState(false);

  useEffect(() => {
    if (!checkoutResult || !stayPreview) {
      navigate("/checkout", { replace: true });
      return;
    }

    setFlowStep("success");
  }, [checkoutResult, navigate, setFlowStep, stayPreview]);

  const locale = useMemo(() => getLocale(i18n.language), [i18n.language]);

  if (!checkoutResult || !stayPreview) {
    return null;
  }

  const conclude = () => {
    clearFlow();
    navigate("/", { replace: true });
  };

  const email = stayPreview.reservation.guest.email;
  const totalPaid = formatCurrency(checkoutResult.totalPaid, stayPreview.reservation.currency, locale);

  return (
    <CheckinFlowLayout>
      <section className="checkout-complete" aria-label={t("successTitle")}>
        <FlowStepHeader step={t("stepSuccess")} title={t("successTitle")} subtitle={t("successSubtitle")} />

        <div className="checkout-complete__layout">
          <article className="checkout-complete__hero-card">
            <div className="checkout-complete__return-animation" aria-hidden="true">
              <div className="checkout-complete__slot" />
              <CreditCard className="checkout-complete__card-icon" />
              <RotateCcw className="checkout-complete__arrow-icon" />
            </div>
            <p className="checkout-settlement__eyebrow">{t("successKeyEyebrow")}</p>
            <h2>{t("successKeyTitle")}</h2>
            <p>{t("successKeyCopy")}</p>
          </article>

          <aside className="checkout-complete__details">
            <div className="checkout-complete__detail-card">
              <ReceiptText />
              <div>
                <span>{t("successReceiptLabel")}</span>
                <strong>{checkoutResult.receiptCode}</strong>
              </div>
            </div>
            <div className="checkout-complete__detail-card">
              <MailCheck />
              <div>
                <span>{t("successEmailLabel")}</span>
                <strong>{email}</strong>
              </div>
            </div>
            <div className="checkout-complete__detail-card">
              <Sparkles />
              <div>
                <span>{t("successPaidLabel")}</span>
                <strong>{totalPaid}</strong>
              </div>
            </div>
          </aside>
        </div>

        <p className="checkout-complete__copy">{t("successCopy")}</p>

        <div className="checkin-payment__actions checkout-complete__actions">
          <button
            type="button"
            className="checkin-action-button checkin-action-button--secondary"
            onClick={() => setReceiptConfirmed(true)}
          >
            {receiptConfirmed ? t("successReceiptSent") : t("successSendReceipt")}
          </button>
          <button type="button" className="checkin-action-button checkin-action-button--primary" onClick={conclude}>
            {t("successEndButton")}
          </button>
        </div>
      </section>
    </CheckinFlowLayout>
  );
}
