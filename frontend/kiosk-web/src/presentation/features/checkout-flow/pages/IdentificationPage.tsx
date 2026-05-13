import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/Button";
import { useCheckoutFlow } from "../context/CheckoutFlowContext";
import { CheckoutFlowLayout } from "../components/CheckoutFlowLayout";
import { CheckoutStepHeader } from "../components/CheckoutStepHeader";
import { CheckoutKeypad } from "../components/CheckoutKeypad";

type InputField = "room" | "document";

function formatDocument(documentNumber: string) {
  const digits = documentNumber.replace(/\D/g, "");

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

export function IdentificationPage() {
  const { t, i18n } = useTranslation("checkout");
  const navigate = useNavigate();
  const { lookupStay, identification, isLoading, setFlowStep, setRecovery, resetError } = useCheckoutFlow();
  const [activeField, setActiveField] = useState<InputField>("room");
  const [roomNumber, setRoomNumber] = useState(identification.roomNumber);
  const [documentNumber, setDocumentNumber] = useState(identification.documentNumber);

  useEffect(() => {
    setFlowStep("identification");
    resetError();
  }, [resetError, setFlowStep]);

  const locale = useMemo(() => {
    if (i18n.language === "pt-BR") return "pt-BR";
    if (i18n.language === "es") return "es-ES";
    return "en-US";
  }, [i18n.language]);

  const handleDigit = (digit: string) => {
    if (activeField === "room") {
      setRoomNumber((current) => (current.length >= 4 ? current : `${current}${digit}`));
      return;
    }

    setDocumentNumber((current) => (current.length >= 11 ? current : `${current}${digit}`));
  };

  const handleBackspace = () => {
    if (activeField === "room") {
      setRoomNumber((current) => current.slice(0, -1));
      return;
    }

    setDocumentNumber((current) => current.slice(0, -1));
  };

  const handleConfirm = async () => {
    const roomValue = roomNumber.replace(/\D/g, "");
    const documentValue = documentNumber.replace(/\D/g, "");

    if (!roomValue || documentValue.length < 11) {
      setRecovery("STAY_NOT_FOUND", t("lookupValidationError"));
      navigate("/checkout/recovery", {
        replace: true,
        state: { code: "STAY_NOT_FOUND", message: t("lookupValidationError") },
      });
      return;
    }

    try {
      await lookupStay(roomValue, documentValue);
      navigate("/checkout/summary");
    } catch {
      navigate("/checkout/recovery", { replace: true });
    }
  };

  return (
    <CheckoutFlowLayout>
      <section className="checkout-identification" aria-label={t("identificationTitle")}>
        <CheckoutStepHeader step={t("stepIdentification")} title={t("identificationTitle")} subtitle={t("identificationSubtitle")} />

        <div className="checkout-identification__layout">
          <div className="checkout-identification__cards">
            <button type="button" className={`checkout-input-card ${activeField === "room" ? "is-selected" : ""}`.trim()} onClick={() => setActiveField("room")}>
              <span className="checkout-input-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9.5V19h12V9.5" />
                  <path d="M8 9.5V6.8A4 4 0 0 1 12 3a4 4 0 0 1 4 3.8v2.7" />
                </svg>
              </span>
              <span className="checkout-input-card__title">{t("roomLabel")}</span>
              <span className="checkout-input-card__value">{roomNumber || t("roomPlaceholder")}</span>
              <span className="checkout-input-card__caption">{t("roomCaption")}</span>
            </button>

            <button type="button" className={`checkout-input-card ${activeField === "document" ? "is-selected" : ""}`.trim()} onClick={() => setActiveField("document")}>
              <span className="checkout-input-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 6.5h14v11H5z" />
                  <path d="M8 10h8" />
                  <path d="M8 13h6" />
                </svg>
              </span>
              <span className="checkout-input-card__title">{t("documentLabel")}</span>
              <span className="checkout-input-card__value">{documentNumber ? formatDocument(documentNumber) : t("documentPlaceholder")}</span>
              <span className="checkout-input-card__caption">{t("documentCaption")}</span>
            </button>

            <article className="checkout-input-card checkout-input-card--ghost" aria-hidden="true">
              <span className="checkout-input-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 5.5h14v13H5z" />
                  <path d="M8 8.5h8" />
                </svg>
              </span>
              <span className="checkout-input-card__title">{t("cardComingSoonTitle")}</span>
              <span className="checkout-input-card__value">{t("cardComingSoonBody")}</span>
              <span className="checkout-input-card__caption">{t("cardComingSoonCaption")}</span>
            </article>
          </div>

          <div className="checkout-identification__entry">
            <label className="checkout-entry-label" htmlFor="checkout-entry">{activeField === "room" ? t("roomLabel") : t("documentLabel")}</label>
            <div className="checkout-entry-field">
              <span className="checkout-entry-field__value" id="checkout-entry">
                {activeField === "room" ? (roomNumber || t("roomPlaceholder")) : (documentNumber ? formatDocument(documentNumber) : t("documentPlaceholder"))}
              </span>
              <span className="checkout-entry-field__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 5l6 7-6 7" />
                </svg>
              </span>
            </div>

            <CheckoutKeypad
              onDigit={handleDigit}
              onBackspace={handleBackspace}
              onConfirm={handleConfirm}
              confirmDisabled={isLoading}
            />

            <div className="checkout-identification__actions">
              <Button variant="secondary" size="lg" onClick={() => navigate("/")}>
                {t("home")}
              </Button>
              <Button variant="primary" size="lg" onClick={handleConfirm} isLoading={isLoading}>
                {t("confirm")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </CheckoutFlowLayout>
  );
}
