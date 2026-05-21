import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckoutRecoveryCode } from "../../../../domain/types";
import { useCheckoutFlow } from "../context/CheckoutFlowContext";
import { CheckoutFlowLayout } from "../components/CheckoutFlowLayout";
import { RecoveryScreen } from "../../../components/common/RecoveryScreen";

interface RecoveryLocationState {
  code?: CheckoutRecoveryCode;
  message?: string;
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

  if (!currentRecovery) {
    return null;
  }

  const retry = () => {
    if (code !== "PAYMENT_DECLINED") {
      clearFlow();
    }
    navigate(code === "PAYMENT_DECLINED" ? "/checkout/summary" : "/checkout", { replace: true });
  };

  const goHome = () => {
    clearFlow();
    navigate("/", { replace: true });
  };

  return (
    <CheckoutFlowLayout className="checkout-layout--recovery">
      <RecoveryScreen
        eyebrow={t("stepRecovery")}
        title={t("sharedRecoveryTitle")}
        body={t("sharedRecoveryBody")}
        primaryAction={{
          label: t("retryLookup"),
          onClick: retry,
          variant: "primary",
        }}
        secondaryAction={{
          label: t("goReception"),
          onClick: goHome,
          variant: "secondary",
        }}
      />
    </CheckoutFlowLayout>
  );
}
