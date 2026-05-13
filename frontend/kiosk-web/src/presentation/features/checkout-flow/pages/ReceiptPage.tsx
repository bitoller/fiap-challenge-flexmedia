import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/Button";
import { useCheckoutFlow } from "../context/CheckoutFlowContext";
import { CheckoutFlowLayout } from "../components/CheckoutFlowLayout";
import { CheckoutStepHeader } from "../components/CheckoutStepHeader";
import { CheckoutChargeList } from "../components/CheckoutChargeList";

function formatCurrency(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

export function ReceiptPage() {
  const { t, i18n } = useTranslation("checkout");
  const navigate = useNavigate();
  const { stayPreview, checkoutResult, receiptEmail, setReceiptEmail, clearFlow } = useCheckoutFlow();
  const [queued, setQueued] = useState(false);

  useEffect(() => {
    if (!stayPreview || !checkoutResult) {
      navigate("/checkout", { replace: true });
    }
  }, [checkoutResult, navigate, stayPreview]);

  const locale = useMemo(() => {
    if (i18n.language === "pt-BR") return "pt-BR";
    if (i18n.language === "es") return "es-ES";
    return "en-US";
  }, [i18n.language]);

  if (!stayPreview || !checkoutResult) {
    return null;
  }

  const totalPaid = formatCurrency(checkoutResult.totalPaid, stayPreview.reservation.currency, locale);

  const conclude = () => {
    navigate("/checkout/success");
  };

  return (
    <CheckoutFlowLayout>
      <section className="checkout-receipt" aria-label={t("receiptTitle")}>
        <div className="checkout-receipt__layout">
          <article className="checkout-receipt__summary">
            <CheckoutStepHeader step={t("stepReceipt")} title={t("receiptTitle")} subtitle={t("receiptSubtitle")} />

            <div className="checkout-receipt__bill">
              <div className="checkout-receipt__bill-head">
                <div>
                  <span>{t("receiptRoomLabel", { room: stayPreview.reservation.room.number })}</span>
                  <strong>{t("receiptFolioTitle")}</strong>
                </div>
                <small>{t("receiptCodeLabel", { code: checkoutResult.receiptCode })}</small>
              </div>

              <CheckoutChargeList charges={stayPreview.charges} currency={stayPreview.reservation.currency} locale={locale} />

              <div className="checkout-receipt__total">
                <span>{t("receiptTotalLabel")}</span>
                <strong>{totalPaid}</strong>
              </div>
            </div>

            <div className="checkout-receipt__buttons">
              <Button variant="secondary" size="lg" onClick={() => window.print()}>
                {t("receiptPrint")}
              </Button>
              <Button variant="primary" size="lg" onClick={conclude}>
                {t("receiptFinish")}
              </Button>
            </div>
          </article>

          <aside className="checkout-receipt__email">
            <div className="checkout-receipt__email-header">
              <span>{t("receiptEmailLabel")}</span>
              <strong>{t("receiptEmailTitle")}</strong>
            </div>

            <label className="checkout-receipt__field">
              <span>{t("receiptEmailField")}</span>
              <input
                type="email"
                value={receiptEmail}
                onChange={(event) => setReceiptEmail(event.target.value)}
                placeholder={t("receiptEmailPlaceholder")}
              />
            </label>

            <div className="checkout-receipt__keyboard" aria-hidden="true">
              {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row) => (
                <div key={row} className="checkout-receipt__keyboard-row">
                  {row.split("").map((key) => (
                    <span key={key}>{key}</span>
                  ))}
                </div>
              ))}
              <div className="checkout-receipt__keyboard-row checkout-receipt__keyboard-row--actions">
                <span>123</span>
                <span>@</span>
                <span className="is-wide">space</span>
                <span>.</span>
                <button type="button" onClick={() => setQueued(true)}>
                  {t("receiptSend")}
                </button>
              </div>
            </div>

            <small className="checkout-receipt__queued">{queued ? t("receiptSent") : t("receiptQueued")}</small>
          </aside>
        </div>
      </section>
    </CheckoutFlowLayout>
  );
}
