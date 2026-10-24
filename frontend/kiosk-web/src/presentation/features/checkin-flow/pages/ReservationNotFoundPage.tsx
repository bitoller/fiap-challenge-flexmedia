import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCheckinFlow } from "../context/CheckinFlowContext";
import { CheckinFlowLayout } from "../components/CheckinFlowLayout";
import { RecoveryScreen } from "../../../components/common/RecoveryScreen";

interface ReservationNotFoundState {
  code?: string;
  searchType?: string;
}

export function ReservationNotFoundPage() {
  const { t } = useTranslation("checkin");
  const navigate = useNavigate();
  const location = useLocation();
  const { error, clearFlow } = useCheckinFlow();
  const state = (location.state ?? {}) as ReservationNotFoundState;
  const currentError = error ?? (state.code ? { code: state.code, message: "" } : null);
  const title = state.searchType === "QR_TOKEN" ? t("qrNotFoundTitle") : t("notFoundTitle");
  const body =
    state.searchType === "CPF"
      ? t("notFoundCpfBody")
      : state.searchType === "RESERVATION_CODE"
        ? t("notFoundReservationBody")
        : state.searchType === "QR_TOKEN"
          ? t("qrNotFoundBody")
          : t("notFoundBody");

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
    navigate("/home", { replace: true });
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
