import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckinSearchType } from "../../../../domain/types";
import { useCheckinFlow } from "../context/CheckinFlowContext";
import { CheckinFlowLayout } from "../components/CheckinFlowLayout";
import { FlowStepHeader } from "../components/FlowStepHeader";

interface ReservationNotFoundState {
  code?: string;
  message?: string;
  searchType?: CheckinSearchType;
}

function ErrorRightContent() {
  return (
    <span className="checkin-topbar__utility-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8.2" />
        <path d="M12 8.2v4.7" />
        <path d="M12 15.8h.01" />
      </svg>
    </span>
  );
}

function isForbiddenMessage(message: string | undefined) {
  if (!message) {
    return false;
  }

  return message.toLowerCase() === "forbidden" || message.toLowerCase() === "access denied";
}

function getNotFoundTitle(searchType: CheckinSearchType | undefined, t: (key: string) => string) {
  if (searchType === "QR_TOKEN") {
    return t("qrNotFoundTitle");
  }

  return t("notFoundTitle");
}

function getNotFoundBody(
  searchType: CheckinSearchType | undefined,
  message: string | undefined,
  t: (key: string) => string
) {
  if (searchType === "QR_TOKEN") {
    return message && !isForbiddenMessage(message) ? message : t("qrNotFoundBody");
  }

  if (searchType === "CPF") {
    return message && !isForbiddenMessage(message) ? message : t("notFoundCpfBody");
  }

  if (searchType === "RESERVATION_CODE") {
    return message && !isForbiddenMessage(message) ? message : t("notFoundReservationBody");
  }

  return message && !isForbiddenMessage(message) ? message : t("genericLookupBody");
}

export function ReservationNotFoundPage() {
  const { t } = useTranslation("checkin");
  const navigate = useNavigate();
  const location = useLocation();
  const { error, clearFlow } = useCheckinFlow();
  const state = (location.state ?? {}) as ReservationNotFoundState;
  const currentError = error ?? (state.code || state.message ? { code: state.code ?? "", message: state.message ?? "" } : null);
  const isNotFound = currentError?.code === "RESERVATION_NOT_FOUND" || !currentError?.code;
  const title = getNotFoundTitle(state.searchType, t);

  useEffect(() => {
    if (!currentError) {
      navigate("/checkin", { replace: true });
    }
  }, [currentError, navigate]);

  const bodyCopy = isNotFound
    ? getNotFoundBody(state.searchType, currentError?.message, t)
    : isForbiddenMessage(currentError?.message)
      ? t("genericLookupBody")
      : currentError?.message || t("genericLookupBody");

  const retry = () => {
    clearFlow();
    navigate("/checkin", { replace: true });
  };

  const goHome = () => {
    clearFlow();
    navigate("/", { replace: true });
  };

  return (
    <CheckinFlowLayout
      topRightContent={<ErrorRightContent />}
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
      <section className="checkin-not-found" aria-label={title}>
        <div className="checkin-not-found__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="6.2" />
            <path d="M12 9.4v2.9" />
            <path d="M12 14.9h.01" />
          </svg>
        </div>

        <FlowStepHeader step={t("stepRecovery")} title={title} subtitle={bodyCopy} />

        <div className="checkin-not-found__actions">
          <button type="button" className="checkin-action-button checkin-action-button--primary" onClick={retry}>
            <span className="checkin-action-button__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 8a7 7 0 0 1 10.5-1.5L20 9" />
                <path d="M19 4v5h-5" />
              </svg>
            </span>
            <span>{t("retryLookup")}</span>
          </button>

          <button type="button" className="checkin-action-button checkin-action-button--secondary" onClick={goHome}>
            <span className="checkin-action-button__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 13a5 5 0 0 1 10 0v4H7v-4Z" />
                <path d="M12 4.5v3" />
                <path d="M9.5 8.5h5" />
              </svg>
            </span>
            <span>{t("backToHome")}</span>
          </button>
        </div>
      </section>
    </CheckinFlowLayout>
  );
}
