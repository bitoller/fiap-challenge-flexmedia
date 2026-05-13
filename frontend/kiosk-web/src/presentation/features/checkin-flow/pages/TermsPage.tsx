import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/Button";
import { ApiError } from "../../../../domain/errors";
import { useCheckinFlow } from "../context/CheckinFlowContext";
import { CheckinFlowLayout } from "../components/CheckinFlowLayout";
import { FlowStepHeader } from "../components/FlowStepHeader";

export function TermsPage() {
  const { t } = useTranslation("checkin");
  const navigate = useNavigate();
  const { reservation, acceptTerms, isLoading, setRecovery } = useCheckinFlow();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [biometricsAccepted, setBiometricsAccepted] = useState(true);

  useEffect(() => {
    if (!reservation) {
      navigate("/checkin", { replace: true });
    }
  }, [navigate, reservation]);

  if (!reservation) {
    return null;
  }

  const continueToPayment = async () => {
    try {
      await acceptTerms(biometricsAccepted);
      navigate("/checkin/payment");
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null;
      const code = apiError?.code === "BIOMETRY_REJECTED" ? "BIOMETRY_REJECTED" : "DOCUMENT_REJECTED";
      setRecovery(code, apiError?.message ?? t("termsErrorBody"));
      navigate("/checkin/recovery", {
        replace: true,
        state: { code, message: apiError?.message },
      });
    }
  };

  return (
    <CheckinFlowLayout
      topRightContent={<span className="checkin-topbar__confirmation-label">{t("termsTag")}</span>}
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
      <section className="checkin-terms" aria-label={t("termsTitle")}>
        <FlowStepHeader
          step={t("stepTerms")}
          title={t("termsTitle")}
          subtitle={t("termsSubtitle")}
        />

        <div className="checkin-terms__panel">
          <ol className="checkin-terms__list">
            <li>
              <h3>{t("termsRuleOneTitle")}</h3>
              <p>{t("termsRuleOneBody")}</p>
            </li>
            <li>
              <h3>{t("termsRuleTwoTitle")}</h3>
              <p>{t("termsRuleTwoBody")}</p>
            </li>
            <li>
              <h3>{t("termsRuleThreeTitle")}</h3>
              <p>{t("termsRuleThreeBody")}</p>
            </li>
          </ol>

          <div className="checkin-terms__consents">
            <label className="checkin-consent">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
              />
              <span>{t("termsAcceptLabel")}</span>
            </label>
            <label className="checkin-consent">
              <input
                type="checkbox"
                checked={biometricsAccepted}
                onChange={(event) => setBiometricsAccepted(event.target.checked)}
              />
              <span>{t("termsBiometryLabel")}</span>
            </label>
          </div>
        </div>

        <div className="checkin-terms__actions">
          <Button variant="secondary" size="lg" onClick={() => navigate("/checkin/contact")}>
            {t("back")}
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={continueToPayment}
            disabled={!acceptedTerms}
            isLoading={isLoading}
          >
            {t("continue")}
          </Button>
        </div>
      </section>
    </CheckinFlowLayout>
  );
}
