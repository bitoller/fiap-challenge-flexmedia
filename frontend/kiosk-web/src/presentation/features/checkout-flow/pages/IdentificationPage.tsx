import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Fingerprint, ScanFace } from "lucide-react";
import { useCheckoutFlow } from "../context/CheckoutFlowContext";
import { CameraCapturePanel } from "../../checkin-flow/components/CameraCapturePanel";
import { CheckinFlowLayout } from "../../checkin-flow/components/CheckinFlowLayout";
import { FlowStepHeader } from "../../checkin-flow/components/FlowStepHeader";
import { MethodOptionCard } from "../../checkin-flow/components/MethodOptionCard";
import { NumericKeypad } from "../../checkin-flow/components/NumericKeypad";

type CheckoutLookupMethod = "document" | "face";

interface CheckoutHomeButtonProps {
  label: string;
  onClick: () => void;
}

function formatDocument(documentNumber: string) {
  const digits = documentNumber.replace(/\D/g, "");

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

function CheckoutHomeButton({ label, onClick }: CheckoutHomeButtonProps) {
  return (
    <button type="button" className="checkin-action-button checkin-action-button--secondary" onClick={onClick}>
      <span className="checkin-action-button__icon" aria-hidden="true">
        <ArrowLeft />
      </span>
      <span>{label}</span>
    </button>
  );
}

export function IdentificationPage() {
  const { t } = useTranslation("checkout");
  const navigate = useNavigate();
  const { lookupStay, lookupStayByFace, isLoading, setFlowStep, resetError } = useCheckoutFlow();
  const [method, setMethod] = useState<CheckoutLookupMethod>("face");
  const [documentNumber, setDocumentNumber] = useState("");
  const documentDigits = documentNumber.replace(/\D/g, "");
  const canConfirm = method === "document" && documentDigits.length === 11;

  useEffect(() => {
    setFlowStep("identification");
    resetError();
    setMethod("face");
    setDocumentNumber("");
  }, [resetError, setFlowStep]);

  const handleDigit = (digit: string) => {
    if (method !== "document") {
      return;
    }

    setDocumentNumber((current) => (current.length >= 11 ? current : `${current}${digit}`));
  };

  const handleBackspace = () => {
    if (method !== "document") {
      return;
    }

    setDocumentNumber((current) => current.slice(0, -1));
  };

  const handleConfirm = async () => {
    if (!canConfirm) {
      return;
    }

    try {
      await lookupStay("", documentDigits);
      navigate("/checkout/summary");
    } catch {
      navigate("/checkout/recovery", { replace: true });
    }
  };

  const handleFaceCapture = async (imageBase64: string, mimeType: string) => {
    try {
      await lookupStayByFace(imageBase64, mimeType);
      navigate("/checkout/summary");
    } catch {
      navigate("/checkout/recovery", { replace: true });
    }
  };

  return (
    <CheckinFlowLayout>
      <section className="checkout-identification checkin-identification" aria-label={t("identificationTitle")}>
        <FlowStepHeader
          step={t("stepIdentification")}
          title={t("identificationTitle")}
          subtitle={t("identificationSubtitle")}
        />

        <div className="checkin-identification__layout">
          <div className="checkin-identification__methods">
            <MethodOptionCard
              title={t("faceMethodTitle")}
              subtitle={t("faceMethodCaption")}
              icon={<ScanFace />}
              selected={method === "face"}
              onClick={() => setMethod("face")}
            />
            <MethodOptionCard
              title={t("documentMethodTitle")}
              subtitle={t("documentMethodCaption")}
              icon={<Fingerprint />}
              selected={method === "document"}
              onClick={() => setMethod("document")}
            />
          </div>

          {method === "document" ? (
            <div className="checkin-identification__entry is-lookup">
              <label className="checkin-identification__field-label" htmlFor="checkout-entry">{t("documentLabel")}</label>
              <div className="checkin-identification__field">
                <input id="checkout-entry" readOnly value={documentNumber ? formatDocument(documentNumber) : ""} aria-label={t("documentLabel")} />
                <span className="checkin-identification__field-icon" aria-hidden="true">
                  <Fingerprint />
                </span>
              </div>
              <p className="checkin-identification__helper">{t("documentLookupHelper")}</p>
              {isLoading ? (
                <div className="checkin-identification__loading" role="status" aria-live="polite">
                  <span className="checkin-identification__loading-spinner" aria-hidden="true" />
                  <p>{t("searchingStay")}</p>
                </div>
              ) : null}
              <NumericKeypad
                onDigit={handleDigit}
                onBackspace={handleBackspace}
                onConfirm={handleConfirm}
                confirmDisabled={isLoading || !canConfirm}
              />
              <div className="checkin-identification__entry-footer">
                <CheckoutHomeButton label={t("home")} onClick={() => navigate("/home")} />
              </div>
            </div>
          ) : (
            <div className="checkout-identification__identity-panel">
              <div className="checkin-identity__panel">
                <CameraCapturePanel
                  label={t("faceCameraLabel")}
                  instruction={t("faceCameraInstruction")}
                  captureLabel={t("faceCapture")}
                  confirmCaptureLabel={t("faceUsePhoto")}
                  retakeLabel={t("faceRetake")}
                  readyLabel={t("faceCameraReady")}
                  startingLabel={t("faceCameraStarting")}
                  processingLabel={t("faceSearchingStay")}
                  errorLabel={t("faceCameraError")}
                  disabled={isLoading}
                  onCapture={handleFaceCapture}
                />
              </div>
              <div className="checkin-identification__entry-footer">
                <CheckoutHomeButton label={t("home")} onClick={() => navigate("/home")} />
              </div>
            </div>
          )}
        </div>
      </section>
    </CheckinFlowLayout>
  );
}
