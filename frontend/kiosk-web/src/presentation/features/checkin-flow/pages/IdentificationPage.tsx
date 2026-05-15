import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Fingerprint, QrCode, Ticket } from "lucide-react";
import { ApiError } from "../../../../domain/errors";
import { CheckinMethod, CheckinSearchType } from "../../../../domain/types";
import { useCheckinFlow } from "../context/CheckinFlowContext";
import { CheckinFlowLayout } from "../components/CheckinFlowLayout";
import { FlowStepHeader } from "../components/FlowStepHeader";
import { MethodOptionCard } from "../components/MethodOptionCard";
import { NumericKeypad } from "../components/NumericKeypad";
import { QrScannerPanel } from "../components/QrScannerPanel";

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

function buildSearchType(method: CheckinMethod): CheckinSearchType {
  if (method === "reservation-code") {
    return "RESERVATION_CODE";
  }

  if (method === "qr-code") {
    return "QR_TOKEN";
  }

  return "CPF";
}

function buildSearchValue(method: CheckinMethod, value: string) {
  if (method === "reservation-code") {
    const digits = stripDigits(value);
    return digits.length >= 8 ? `RSV-${digits.slice(0, 4)}-${digits.slice(4, 8)}` : `RSV-${digits}`;
  }

  if (method === "qr-code") {
    return value.trim();
  }

  return stripDigits(value).slice(0, 11);
}

function formatDisplayValue(method: CheckinMethod, value: string) {
  if (method === "reservation-code") {
    return formatReservationCode(value);
  }

  if (method === "cpf") {
    return formatCpf(value);
  }

  return "";
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

  useEffect(() => {
    setValue("");
    setSubmittedOnce(false);
    resetError();
  }, [method, resetError]);

  const searchType = buildSearchType(method);
  const normalizedValue = useMemo(() => buildSearchValue(method, value), [method, value]);
  const displayValue = useMemo(() => formatDisplayValue(method, value), [method, value]);
  const isQrMode = method === "qr-code";
  const digits = stripDigits(value);
  const isValid =
    method === "reservation-code"
      ? digits.length >= 8
      : method === "cpf"
        ? digits.length === 11
        : normalizedValue.length > 0;

  const helperLabel =
    method === "reservation-code"
      ? t("reservationLabel")
      : method === "qr-code"
        ? t("qrScannerFieldLabel")
        : t("cpfLabel");

  const helperCopy =
    method === "reservation-code"
      ? t("reservationHelper")
      : method === "qr-code"
        ? t("qrScannerBody")
        : t("cpfHelper");

  const appendDigit = (digit: string) => {
    if (method === "qr-code") {
      return;
    }

    const limit = method === "reservation-code" ? 8 : 11;
    setValue((current) => stripDigits(current).concat(digit).slice(0, limit));
  };

  const removeDigit = () => {
    if (method === "qr-code") {
      return;
    }

    setValue((current) => stripDigits(current).slice(0, -1));
  };

  const submit = useCallback(
    async (nextMethod: CheckinMethod, nextValue: string) => {
      const nextSearchType = buildSearchType(nextMethod);
      const nextSearchValue = buildSearchValue(nextMethod, nextValue);

      if (nextMethod !== "qr-code" && !nextSearchValue) {
        setSubmittedOnce(true);
        return;
      }

      try {
        await startIdentification(nextSearchType, nextSearchValue, i18n.language);
        navigate("/checkin/confirmation", { replace: true });
      } catch (error) {
        const apiError = error instanceof ApiError ? error : null;
        const code = apiError?.code ?? "RESERVATION_NOT_FOUND";
        const message = apiError?.message ?? t("genericLookupBody");

        if (code === "RESERVATION_NOT_ELIGIBLE") {
          navigate("/checkin/recovery", {
            replace: true,
            state: { code, message },
          });
          return;
        }

        navigate("/checkin/not-found", {
          replace: true,
          state: {
            code,
            message,
            searchType: nextSearchType,
          },
        });
      }
    },
    [i18n.language, navigate, startIdentification, t]
  );

  const handleQrToken = useCallback((token: string) => {
    const normalizedToken = token.trim();
    if (!normalizedToken) {
      return;
    }

    setValue(normalizedToken);
    void submit("qr-code", normalizedToken);
  }, [submit]);

  const handleQrFallback = useCallback(() => {
    setMethod("cpf");
  }, []);

  return (
    <CheckinFlowLayout>
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
              icon={<Fingerprint />}
              selected={method === "cpf"}
              onClick={() => setMethod("cpf")}
            />
            <MethodOptionCard
              title={t("reservationMethodTitle")}
              subtitle={t("reservationMethodSubtitle")}
              icon={<Ticket />}
              selected={method === "reservation-code"}
              onClick={() => setMethod("reservation-code")}
            />
            <MethodOptionCard
              title={t("qrMethodTitle")}
              subtitle={t("qrMethodSubtitle")}
              icon={<QrCode />}
              selected={method === "qr-code"}
              onClick={() => setMethod("qr-code")}
            />
          </div>

          <div className={`checkin-identification__entry ${isQrMode ? "is-qr" : "is-lookup"}`.trim()}>
            {isQrMode ? (
              <QrScannerPanel
                active={isQrMode}
                onTokenDetected={handleQrToken}
                onFallback={handleQrFallback}
              />
            ) : (
              <>
                <div className="checkin-identification__field-label">{helperLabel}</div>
                <div className={`checkin-identification__field ${submittedOnce && !isValid ? "is-invalid" : ""}`.trim()}>
                  <input readOnly value={displayValue} aria-label={helperLabel} />
                  <span className="checkin-identification__field-icon" aria-hidden="true">
                    {method === "reservation-code" ? <Ticket /> : <Fingerprint />}
                  </span>
                </div>
                <p className="checkin-identification__helper">{helperCopy}</p>
                {isLoading ? (
                  <div className="checkin-identification__loading" role="status" aria-live="polite">
                    <span className="checkin-identification__loading-spinner" aria-hidden="true" />
                    <p>{t("searchingReservation")}</p>
                  </div>
                ) : null}
                <NumericKeypad
                  onDigit={appendDigit}
                  onBackspace={removeDigit}
                  onConfirm={() => void submit(method, value)}
                  confirmDisabled={!isValid || isLoading}
                />
              </>
            )}

            <div className="checkin-identification__entry-footer">
              <button
                type="button"
                className="checkin-action-button checkin-action-button--secondary"
                onClick={() => navigate("/")}
              >
                <span className="checkin-action-button__icon" aria-hidden="true">
                  <ArrowRight />
                </span>
                <span>{t("backToHome")}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </CheckinFlowLayout>
  );
}
