import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ApiError } from "../../../../domain/errors";
import { CheckoutResponse, CheckoutStayPreview } from "../../../../domain/models";
import {
  CheckoutFlowStep,
  CheckoutIdentificationDraft,
  CheckoutPaymentMethod,
  CheckoutRecoveryCode,
} from "../../../../domain/types";
import { KIOSK_CONFIG } from "../../../../core/constants";
import { checkoutRepository } from "../../../../data/repositories/checkoutRepository";

interface RecoveryState {
  code: CheckoutRecoveryCode;
  message: string;
}

interface CheckoutFlowContextValue {
  stayPreview: CheckoutStayPreview | null;
  checkoutResult: CheckoutResponse | null;
  identification: CheckoutIdentificationDraft;
  paymentMethod: CheckoutPaymentMethod;
  receiptEmail: string;
  flowStep: CheckoutFlowStep;
  recovery: RecoveryState | null;
  isLoading: boolean;
  error: ApiError | null;
  lookupStay: (roomNumber: string, documentNumber: string) => Promise<CheckoutStayPreview>;
  completeCheckout: () => Promise<CheckoutResponse>;
  setPaymentMethod: (paymentMethod: CheckoutPaymentMethod) => void;
  setReceiptEmail: (email: string) => void;
  setFlowStep: (step: CheckoutFlowStep) => void;
  setRecovery: (code: CheckoutRecoveryCode, message: string) => void;
  clearFlow: () => void;
  resetError: () => void;
}

const CheckoutFlowContext = createContext<CheckoutFlowContextValue | undefined>(undefined);

function mapApiErrorToRecoveryCode(error: ApiError): CheckoutRecoveryCode {
  if (error.code === "PAYMENT_DECLINED") {
    return "PAYMENT_DECLINED";
  }

  if (error.code === "STAY_NOT_FOUND") {
    return "STAY_NOT_FOUND";
  }

  if (error.code === "STAY_ALREADY_CHECKED_OUT") {
    return "STAY_ALREADY_CHECKED_OUT";
  }

  return "CHECKOUT_LOOKUP_FAILED";
}

export function CheckoutFlowProvider({ children }: { children: React.ReactNode }) {
  const [stayPreview, setStayPreview] = useState<CheckoutStayPreview | null>(null);
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResponse | null>(null);
  const [identification, setIdentification] = useState<CheckoutIdentificationDraft>({
    roomNumber: "",
    documentNumber: "",
  });
  const [paymentMethod, setPaymentMethodState] = useState<CheckoutPaymentMethod>("CARD");
  const [receiptEmail, setReceiptEmailState] = useState("");
  const [flowStep, setFlowStepState] = useState<CheckoutFlowStep>("identification");
  const [recovery, setRecoveryState] = useState<RecoveryState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const clearFlow = useCallback(() => {
    setStayPreview(null);
    setCheckoutResult(null);
    setIdentification({ roomNumber: "", documentNumber: "" });
    setPaymentMethodState("CARD");
    setReceiptEmailState("");
    setFlowStepState("identification");
    setRecoveryState(null);
    setIsLoading(false);
    setError(null);
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const setFlowStep = useCallback((step: CheckoutFlowStep) => {
    setFlowStepState(step);
  }, []);

  const setRecovery = useCallback((code: CheckoutRecoveryCode, message: string) => {
    const apiError = new ApiError(code, message);
    setRecoveryState({ code, message });
    setFlowStepState("recovery");
    setError(apiError);
  }, []);

  const lookupStay = useCallback(async (roomNumber: string, documentNumber: string) => {
    setIsLoading(true);
    setError(null);
    setRecoveryState(null);
    setIdentification({ roomNumber, documentNumber });

    try {
      const preview = await checkoutRepository.lookupStay(
        KIOSK_CONFIG.ACTIVE_HOTEL_ID,
        roomNumber,
        "CPF",
        documentNumber
      );

      setStayPreview(preview);
      setFlowStepState("summary");
      return preview;
    } catch (cause) {
      const apiError =
        cause instanceof ApiError
          ? cause
          : new ApiError("CHECKOUT_LOOKUP_FAILED", "The stay could not be located right now.");

      setError(apiError);
      setRecoveryState({
        code: mapApiErrorToRecoveryCode(apiError),
        message: apiError.message,
      });
      setFlowStepState("recovery");
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeCheckout = useCallback(async () => {
    if (!stayPreview) {
      throw new ApiError("CHECKOUT_NOT_READY", "Checkout could not be completed right now.");
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await checkoutRepository.completeCheckout(stayPreview.stayId, paymentMethod);
      setCheckoutResult(result);
      setFlowStepState("receipt");
      return result;
    } catch (cause) {
      const apiError =
        cause instanceof ApiError
          ? cause
          : new ApiError("CHECKOUT_FAILED", "Checkout could not be completed right now.");

      setError(apiError);
      setRecoveryState({
        code: mapApiErrorToRecoveryCode(apiError),
        message: apiError.message,
      });
      setFlowStepState("recovery");
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [paymentMethod, stayPreview]);

  const value = useMemo<CheckoutFlowContextValue>(
    () => ({
      stayPreview,
      checkoutResult,
      identification,
      paymentMethod,
      receiptEmail,
      flowStep,
      recovery,
      isLoading,
      error,
      lookupStay,
      completeCheckout,
      setPaymentMethod: setPaymentMethodState,
      setReceiptEmail: setReceiptEmailState,
      setFlowStep,
      setRecovery,
      clearFlow,
      resetError,
    }),
    [
      checkoutResult,
      clearFlow,
      completeCheckout,
      error,
      flowStep,
      identification,
      isLoading,
      lookupStay,
      paymentMethod,
      receiptEmail,
      recovery,
      resetError,
      setFlowStep,
      setRecovery,
      stayPreview,
    ]
  );

  return <CheckoutFlowContext.Provider value={value}>{children}</CheckoutFlowContext.Provider>;
}

export function useCheckoutFlow() {
  const context = useContext(CheckoutFlowContext);

  if (!context) {
    throw new Error("useCheckoutFlow must be used within a CheckoutFlowProvider");
  }

  return context;
}
