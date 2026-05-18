import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BadgeCheck, FileScan, ShieldCheck, Sparkles } from "lucide-react";
import { CheckinRecoveryCode } from "../../../../domain/types";
import { CheckinFlowLayout } from "../components/CheckinFlowLayout";
import { FlowStepHeader } from "../components/FlowStepHeader";
import { CameraCapturePanel } from "../components/CameraCapturePanel";
import { useCheckinFlow } from "../context/CheckinFlowContext";

type VerificationStage = "document" | "selfie" | "consent";
type VerificationStatus = "document" | "selfie" | "confirmation";

export function IdentityVerificationPage() {
  const { t } = useTranslation("checkin");
  const navigate = useNavigate();
  const {
    reservation,
    identityVerification,
    isLoading,
    verifyIdentityDocument,
    verifyIdentitySelfie,
    confirmIdentityVerification,
    setFlowStep,
    setRecovery,
  } = useCheckinFlow();
  const [stage, setStage] = useState<VerificationStage>("document");
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [biometricConsentAccepted, setBiometricConsentAccepted] = useState(false);

  useEffect(() => {
    if (!reservation) {
      navigate("/checkin", { replace: true });
    }
  }, [navigate, reservation]);

  const canConfirm = useMemo(() => {
    return stage === "consent" && termsAccepted && biometricConsentAccepted && Boolean(identityVerification?.canContinue);
  }, [biometricConsentAccepted, identityVerification?.canContinue, stage, termsAccepted]);

  if (!reservation) {
    return null;
  }

  const showRecovery = (code: CheckinRecoveryCode, messageKey: string) => {
    const message = t(messageKey);
    setRecovery(code, message);
    navigate("/checkin/recovery", {
      replace: true,
      state: { code, message },
    });
  };

  const handleDocumentCapture = async (imageBase64: string, mimeType: string) => {
    setVerificationStatus("document");

    try {
      const result = await verifyIdentityDocument(imageBase64, mimeType);
      if (result.documentStatus === "APPROVED") {
        setStage("selfie");
        return;
      }

      showRecovery("DOCUMENT_REJECTED", "recoveryDocumentBody");
    } catch {
      navigate("/checkin/recovery", { replace: true });
    } finally {
      setVerificationStatus(null);
    }
  };

  const handleSelfieCapture = async (imageBase64: string, mimeType: string) => {
    setVerificationStatus("selfie");

    try {
      const result = await verifyIdentitySelfie(imageBase64, mimeType);
      if (result.canContinue) {
        setStage("consent");
        return;
      }

      showRecovery("BIOMETRY_REJECTED", "recoveryBiometryBody");
    } catch {
      navigate("/checkin/recovery", { replace: true });
    } finally {
      setVerificationStatus(null);
    }
  };

  const continueToPayment = async () => {
    setVerificationStatus("confirmation");

    try {
      await confirmIdentityVerification(termsAccepted, biometricConsentAccepted);
      setFlowStep("add-ons");
      navigate("/checkin/add-ons");
    } catch {
      navigate("/checkin/recovery", { replace: true });
    } finally {
      setVerificationStatus(null);
    }
  };

  const verificationStatusLabel =
    verificationStatus === "document"
      ? t("identityVerifyingDocument")
      : verificationStatus === "selfie"
        ? t("identityVerifyingSelfie")
        : verificationStatus === "confirmation"
          ? t("identityVerifyingConfirmation")
          : null;

  return (
    <CheckinFlowLayout>
      <section className="checkin-identity" aria-label={t("identityTitle")}>
        <FlowStepHeader
          step={t("stepIdentity")}
          title={t("identityTitle")}
          subtitle={t("identitySubtitle")}
        />

        <div className="checkin-identity__layout">
          <aside className="checkin-identity__steps" aria-label={t("identityProgressLabel")}>
            <div className={`checkin-identity__step ${stage === "document" ? "is-active" : ""} ${identityVerification?.documentStatus === "APPROVED" ? "is-complete" : ""}`}>
              <FileScan aria-hidden="true" />
              <div>
                <span>{t("identityDocumentStep")}</span>
                <p>{t("identityDocumentStepBody")}</p>
              </div>
            </div>
            <div className={`checkin-identity__step ${stage === "selfie" ? "is-active" : ""} ${identityVerification?.canContinue ? "is-complete" : ""}`}>
              <Sparkles aria-hidden="true" />
              <div>
                <span>{t("identitySelfieStep")}</span>
                <p>{t("identitySelfieStepBody")}</p>
              </div>
            </div>
            <div className={`checkin-identity__step ${stage === "consent" ? "is-active" : ""}`}>
              <ShieldCheck aria-hidden="true" />
              <div>
                <span>{t("identityConsentStep")}</span>
                <p>{t("identityConsentStepBody")}</p>
              </div>
            </div>
          </aside>

          <div className="checkin-identity__panel">
            {verificationStatusLabel && (
              <div className="checkin-identity__verification-status" role="status" aria-live="polite">
                <span className="checkin-identification__loading-spinner" aria-hidden="true" />
                <span>{verificationStatusLabel}</span>
              </div>
            )}

            {stage === "document" && (
              <CameraCapturePanel
                label={t("identityDocumentTitle")}
                instruction={t("identityDocumentInstruction")}
                captureLabel={t("identityCaptureDocument")}
                retakeLabel={t("identityRetake")}
                readyLabel={t("identityCameraReady")}
                startingLabel={t("identityCameraStarting")}
                processingLabel={t("identityProcessing")}
                errorLabel={t("identityCameraError")}
                disabled={isLoading}
                onCapture={handleDocumentCapture}
              />
            )}

            {stage === "selfie" && (
              <CameraCapturePanel
                label={t("identitySelfieTitle")}
                instruction={t("identitySelfieInstruction")}
                captureLabel={t("identityCaptureSelfie")}
                retakeLabel={t("identityRetake")}
                readyLabel={t("identityCameraReady")}
                startingLabel={t("identityCameraStarting")}
                processingLabel={t("identityProcessing")}
                errorLabel={t("identityCameraError")}
                disabled={isLoading}
                onCapture={handleSelfieCapture}
              />
            )}

            {stage === "consent" && (
              <article className="checkin-identity__consent-card">
                <div className="checkin-identity__approved-icon">
                  <BadgeCheck aria-hidden="true" />
                </div>
                <p className="checkin-identity__eyebrow">{t("identityApprovedEyebrow")}</p>
                <h2>{identityVerification?.fallbackUsed ? t("identityFallbackTitle") : t("identityApprovedTitle")}</h2>
                <p>{identityVerification?.fallbackUsed ? t("identityFallbackBody") : t("identityApprovedBody")}</p>

                <label className="checkin-identity__checkbox">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(event) => setTermsAccepted(event.target.checked)}
                  />
                  <span>{t("identityTermsConsent")}</span>
                </label>
                <label className="checkin-identity__checkbox">
                  <input
                    type="checkbox"
                    checked={biometricConsentAccepted}
                    onChange={(event) => setBiometricConsentAccepted(event.target.checked)}
                  />
                  <span>{t("identityBiometricConsent")}</span>
                </label>
              </article>
            )}
          </div>
        </div>

        <div className="checkin-identity__actions">
          <button type="button" className="checkin-action-button checkin-action-button--ghost" onClick={() => navigate("/checkin/confirmation")}>
            {t("back")}
          </button>
          <button type="button" className="checkin-action-button checkin-action-button--primary" onClick={continueToPayment} disabled={!canConfirm || isLoading}>
            {t("confirmReservation")}
          </button>
        </div>
      </section>
    </CheckinFlowLayout>
  );
}
