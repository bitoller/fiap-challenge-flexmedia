import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ApiError } from "../../../../domain/errors";
import { CheckinMethod } from "../../../../domain/types";
import { useCheckinFlow } from "../context/CheckinFlowContext";
import { CheckinFlowLayout } from "../components/CheckinFlowLayout";
import { FlowStepHeader } from "../components/FlowStepHeader";
import { MethodOptionCard } from "../components/MethodOptionCard";
import { NumericKeypad } from "../components/NumericKeypad";

function stripDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCpf(value: string) {
  const digits = stripDigits(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function formatReservationCode(value: string) {
  const digits = stripDigits(value).slice(0, 8);
  if (!digits) {
    return "";
  }

  if (digits.length <= 4) {
    return `RSV-${digits}`;
  }

  return `RSV-${digits.slice(0, 4)}-${digits.slice(4, 8)}`;
}

function buildSearchValue(method: CheckinMethod, value: string) {
  const digits = stripDigits(value);

  if (method === "reservation-code") {
    return digits.length >= 8 ? `RSV-${digits.slice(0, 4)}-${digits.slice(4, 8)}` : `RSV-${digits}`;
  }

  return digits.slice(0, 11);
}

function IdentificationRightContent() {
  return (
    <span className="checkin-topbar__utility-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 20h6" />
        <path d="M10 20v-1h4v1" />
        <path d="M8 6.5a4 4 0 0 1 8 0c0 1.9-.9 3-1.8 4.1-.8 1-1.2 1.8-1.2 3.4h-2c0-1.6-.4-2.4-1.2-3.4C8.9 9.5 8 8.4 8 6.5Z" />
      </svg>
    </span>
  );
}

export function IdentificationPage() {
  const { t, i18n } = useTranslation("checkin");
  const navigate = useNavigate();
  const { startIdentification, isLoading, clearFlow, resetError } = useCheckinFlow();
  const [method, setMethod] = useState<CheckinMethod>("cpf");
  const [value, setValue] = useState("");
  const [submittedOnce, setSubmittedOnce] = useState(false);

  useEffect(() => {
    clearFlow();
    resetError();
    setValue("");
    setMethod("cpf");
  }, [clearFlow, resetError]);

  const searchType = method === "reservation-code" ? "RESERVATION_CODE" : "CPF";
  const normalizedValue = useMemo(() => buildSearchValue(method, value), [method, value]);
  const digits = stripDigits(value);
  const displayValue = method === "reservation-code" ? formatReservationCode(value) : formatCpf(value);
  const isValid = method === "reservation-code" ? digits.length >= 8 : digits.length === 11;

  const helperLabel = method === "reservation-code" ? t("reservationLabel") : t("cpfLabel");
  const placeholder = method === "reservation-code" ? t("reservationPlaceholder") : t("cpfPlaceholder");

  const appendDigit = (digit: string) => {
    const limit = method === "reservation-code" ? 8 : 11;
    setValue((current) => stripDigits(current).concat(digit).slice(0, limit));
  };

  const removeDigit = () => {
    setValue((current) => stripDigits(current).slice(0, -1));
  };

  const submit = async () => {
    setSubmittedOnce(true);

    if (!isValid) {
      return;
    }

    try {
      await startIdentification(searchType, normalizedValue, i18n.language);
      navigate("/checkin/confirmation", { replace: true });
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null;
      navigate("/checkin/not-found", {
        replace: true,
        state: {
          code: apiError?.code ?? "RESERVATION_NOT_FOUND",
          message: apiError?.message,
        },
      });
    }
  };

  return (
    <CheckinFlowLayout
      topRightContent={<IdentificationRightContent />}
      bottomItems={[
        {
          key: "home",
          label: t("bottomHome"),
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
      <section className="checkin-identification" aria-label={t("stepOneTitle")}>
        <FlowStepHeader
          step={t("stepOne")}
          title={t("identifyTitle")}
          subtitle={t("identifySubtitle")}
        />

        <div className="checkin-identification__layout">
          <div className="checkin-identification__methods">
            <MethodOptionCard
              title={t("cpfMethodTitle")}
              subtitle={t("cpfMethodSubtitle")}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="6" width="16" height="12" rx="1.8" />
                  <path d="M7.5 12h9" />
                  <path d="M9 15.2h6" />
                </svg>
              }
              selected={method === "cpf"}
              onClick={() => setMethod("cpf")}
            />
            <MethodOptionCard
              title={t("reservationMethodTitle")}
              subtitle={t("reservationMethodSubtitle")}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 6h14a1.8 1.8 0 0 1 1.8 1.8V9a2 2 0 0 0 0 6v1.2A1.8 1.8 0 0 1 19 18H5a1.8 1.8 0 0 1-1.8-1.8V15a2 2 0 0 0 0-6V7.8A1.8 1.8 0 0 1 5 6Z" />
                  <path d="M9 9.5v5" />
                  <path d="M15 9.5v5" />
                </svg>
              }
              selected={method === "reservation-code"}
              onClick={() => setMethod("reservation-code")}
            />
            <MethodOptionCard
              title={t("qrMethodTitle")}
              subtitle={t("qrMethodSubtitle")}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 5h4v4H5zM15 5h4v4h-4zM5 15h4v4H5z" />
                  <path d="M15 15h4v4h-4z" />
                  <path d="M9 9h2M9 15h2M13 9h2M13 13h2M9 17h2M17 9v2M17 13v2" />
                </svg>
              }
              disabled
            />
            <MethodOptionCard
              title={t("cardMethodTitle")}
              subtitle={t("cardMethodSubtitle")}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="6.5" width="16" height="11" rx="1.5" />
                  <path d="M4 10h16" />
                  <path d="M8 14.2h3.5" />
                </svg>
              }
              disabled
            />
          </div>

          <div className="checkin-identification__entry">
            <div className="checkin-identification__field-label">{helperLabel}</div>
            <div className={`checkin-identification__field ${submittedOnce && !isValid ? "is-invalid" : ""}`.trim()}>
              <input readOnly value={displayValue} placeholder={placeholder} aria-label={helperLabel} />
              <span className="checkin-identification__fingerprint" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4.2a5.8 5.8 0 0 1 5.8 5.8v1.1" />
                  <path d="M8.2 6.7a5.8 5.8 0 0 1 7.6 7.6" />
                  <path d="M6.8 10.3a8.3 8.3 0 0 1 10.4 10.4" />
                  <path d="M9.1 13.1a3.7 3.7 0 0 1 4.8 4.8" />
                </svg>
              </span>
            </div>
            {isLoading ? (
              <div className="checkin-identification__loading" role="status" aria-live="polite">
                <span className="checkin-identification__loading-spinner" aria-hidden="true" />
                <p>{t("searchingReservation")}</p>
              </div>
            ) : null}
            <NumericKeypad
              onDigit={appendDigit}
              onBackspace={removeDigit}
              onConfirm={submit}
              confirmDisabled={!isValid || isLoading}
            />
          </div>
        </div>
      </section>
    </CheckinFlowLayout>
  );
}
