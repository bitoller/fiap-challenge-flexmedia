import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/Button";
import { CheckoutRecoveryCode } from "../../../../domain/types";
import { useCheckoutFlow } from "../context/CheckoutFlowContext";
import { CheckoutFlowLayout } from "../components/CheckoutFlowLayout";
import { CheckoutStepHeader } from "../components/CheckoutStepHeader";

interface RecoveryLocationState {
  code?: CheckoutRecoveryCode;
  message?: string;
}

function getRecoveryTitle(code: CheckoutRecoveryCode | undefined, t: (key: string) => string) {
  if (code === "PAYMENT_DECLINED") return t("recoveryPaymentTitle");
  if (code === "STAY_NOT_FOUND") return t("recoveryStayTitle");
  return t("recoveryGenericTitle");
}

function getRecoveryBody(code: CheckoutRecoveryCode | undefined, t: (key: string) => string) {
  if (code === "PAYMENT_DECLINED") return t("recoveryPaymentBody");
  if (code === "STAY_NOT_FOUND") return t("recoveryStayBody");
  return t("recoveryGenericBody");
}

function getRecoveryRetryPath(code: CheckoutRecoveryCode | undefined) {
  if (code === "PAYMENT_DECLINED") return "/checkout/payment";
  return "/checkout";
}

export function RecoveryPage() {
  const { t } = useTranslation("checkout");
  const navigate = useNavigate();
  const location = useLocation();
  const { recovery, clearFlow } = useCheckoutFlow();
  const state = (location.state ?? {}) as RecoveryLocationState;
  const currentRecovery = recovery ?? (state.code ? { code: state.code, message: state.message ?? "" } : null);

  useEffect(() => {
    if (!currentRecovery) {
      navigate("/checkout", { replace: true });
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
    <CheckoutFlowLayout>
      <section className="checkout-recovery" aria-label={title}>
        <div className="checkout-recovery__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8.2" />
            <path d="M12 8.2v4.6" />
            <path d="M12 15.7h.01" />
          </svg>
        </div>

        <CheckoutStepHeader step={t("stepRecovery")} title={title} subtitle={body} />

        <div className="checkout-recovery__actions">
          <Button variant="primary" size="lg" onClick={retry}>
            {t("retryLookup")}
          </Button>
          <Button variant="secondary" size="lg" onClick={goHome}>
            {t("goReception")}
          </Button>
        </div>
      </section>
    </CheckoutFlowLayout>
  );
}
