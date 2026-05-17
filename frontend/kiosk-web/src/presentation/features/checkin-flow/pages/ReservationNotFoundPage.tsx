import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCheckinFlow } from "../context/CheckinFlowContext";
import { CheckinFlowLayout } from "../components/CheckinFlowLayout";
import { RecoveryScreen } from "../../../components/common/RecoveryScreen";

interface ReservationNotFoundState {
  code?: string;
}

export function ReservationNotFoundPage() {
  const { t } = useTranslation("checkin");
  const navigate = useNavigate();
  const location = useLocation();
  const { error, clearFlow } = useCheckinFlow();
  const state = (location.state ?? {}) as ReservationNotFoundState;
  const currentError = error ?? (state.code ? { code: state.code, message: "" } : null);
  const title = t("sharedRecoveryTitle");

  useEffect(() => {
    if (!currentError) {
      navigate("/checkin", { replace: true });
    }
  }, [currentError, navigate]);

  const retry = () => {
    clearFlow();
    navigate("/checkin", { replace: true });
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
        body={t("sharedRecoveryBody")}
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
