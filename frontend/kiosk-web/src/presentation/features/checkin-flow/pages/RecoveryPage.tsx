import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckinRecoveryCode } from "../../../../domain/types";
import { useCheckinFlow } from "../context/CheckinFlowContext";
import { CheckinFlowLayout } from "../components/CheckinFlowLayout";
import { RecoveryScreen } from "../../../components/common/RecoveryScreen";

interface RecoveryLocationState {
  code?: CheckinRecoveryCode;
  message?: string;
}

function getRecoveryTitle(code: CheckinRecoveryCode | undefined, t: (key: string) => string) {
  return t("sharedRecoveryTitle");
}

export function RecoveryPage() {
  const { t } = useTranslation("checkin");
  const navigate = useNavigate();
  const location = useLocation();
  const { recovery, clearFlow, setFlowStep } = useCheckinFlow();
  const state = (location.state ?? {}) as RecoveryLocationState;
  const currentRecovery = recovery ?? (state.code ? { code: state.code, message: state.message ?? "" } : null);

  useEffect(() => {
    if (!currentRecovery) {
      navigate("/checkin", { replace: true });
    }
  }, [currentRecovery, navigate]);

  const code = currentRecovery?.code;
  const title = getRecoveryTitle(code, t);
  const body = t("sharedRecoveryBody");

  if (!currentRecovery) {
    return null;
  }

  const retry = () => {
    const retryPath =
      code === "PAYMENT_DECLINED"
        ? "/checkin/payment"
        : code === "BIOMETRY_REJECTED" || code === "DOCUMENT_REJECTED"
          ? "/checkin/identity"
          : "/checkin";

    if (code === "PAYMENT_DECLINED") {
      setFlowStep("payment");
    }

    if (code === "BIOMETRY_REJECTED" || code === "DOCUMENT_REJECTED") {
      setFlowStep("identity-verification");
    }

    navigate(retryPath, { replace: true });
  };

  const goHome = () => {
    clearFlow();
    navigate("/", { replace: true });
  };

  return (
    <CheckinFlowLayout className="checkin-layout--recovery">
      <RecoveryScreen
        eyebrow={t("stepRecovery")}
        title={title}
        body={body}
        primaryAction={{
          label: t("retryLookup"),
          onClick: retry,
          variant: "primary",
        }}
        secondaryAction={{
          label: t("backToHome"),
          onClick: goHome,
          variant: "secondary",
        }}
      />
    </CheckinFlowLayout>
  );
}
