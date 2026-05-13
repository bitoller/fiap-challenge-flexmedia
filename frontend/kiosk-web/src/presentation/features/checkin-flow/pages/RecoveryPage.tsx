import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/Button";
import { CheckinRecoveryCode } from "../../../../domain/types";
import { useCheckinFlow } from "../context/CheckinFlowContext";
import { CheckinFlowLayout } from "../components/CheckinFlowLayout";
import { FlowStepHeader } from "../components/FlowStepHeader";

interface RecoveryLocationState {
  code?: CheckinRecoveryCode;
  message?: string;
}

function getRecoveryTitle(code: CheckinRecoveryCode | undefined, t: (key: string) => string) {
  if (code === "PAYMENT_DECLINED") return t("recoveryPaymentTitle");
  if (code === "BIOMETRY_REJECTED") return t("recoveryBiometryTitle");
  if (code === "DOCUMENT_REJECTED") return t("recoveryDocumentTitle");
  return t("recoveryGenericTitle");
}

function getRecoveryBody(code: CheckinRecoveryCode | undefined, t: (key: string) => string) {
  if (code === "PAYMENT_DECLINED") return t("recoveryPaymentBody");
  if (code === "BIOMETRY_REJECTED") return t("recoveryBiometryBody");
  if (code === "DOCUMENT_REJECTED") return t("recoveryDocumentBody");
  return t("recoveryGenericBody");
}

function getRecoveryRetryPath(code: CheckinRecoveryCode | undefined) {
  if (code === "PAYMENT_DECLINED") return "/checkin/payment";
  if (code === "BIOMETRY_REJECTED" || code === "DOCUMENT_REJECTED") return "/checkin/contact";
  return "/checkin";
}

export function RecoveryPage() {
  const { t } = useTranslation("checkin");
  const navigate = useNavigate();
  const location = useLocation();
  const { recovery, clearFlow } = useCheckinFlow();
  const state = (location.state ?? {}) as RecoveryLocationState;
  const currentRecovery = recovery ?? (state.code ? { code: state.code, message: state.message ?? "" } : null);

  useEffect(() => {
    if (!currentRecovery) {
      navigate("/checkin", { replace: true });
    }
  }, [currentRecovery, navigate]);

  const code = currentRecovery?.code;
  const title = useMemo(() => getRecoveryTitle(code, t), [code, t]);
  const body = useMemo(() => getRecoveryBody(code, t), [code, t]);

  if (!currentRecovery) {
    return null;
  }

  const retry = () => {
    navigate(getRecoveryRetryPath(code), { replace: true });
  };

  const goHome = () => {
    clearFlow();
    navigate("/", { replace: true });
  };

  return (
    <CheckinFlowLayout
      topRightContent={<span className="checkin-topbar__confirmation-label">{t("recoveryTag")}</span>}
      bottomItems={[
        {
          key: "home",
          label: t("bottomHomeCompact"),
          icon: "home",
          onClick: () => navigate("/"),
        },
        {
          key: "assistant",
          label: t("bottomSupport"),
          icon: "assistant",
          active: true,
        },
      ]}
    >
      <section className="checkin-recovery" aria-label={title}>
        <div className="checkin-recovery__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8.2" />
            <path d="M12 8.2v4.6" />
            <path d="M12 15.7h.01" />
          </svg>
        </div>

        <FlowStepHeader step={t("stepRecovery")} title={title} subtitle={body} />

        <div className="checkin-recovery__actions">
          <Button variant="primary" size="lg" onClick={retry}>
            {t("retryLookup")}
          </Button>
          <Button variant="secondary" size="lg" onClick={goHome}>
            {t("goReception")}
          </Button>
        </div>
      </section>
    </CheckinFlowLayout>
  );
}
